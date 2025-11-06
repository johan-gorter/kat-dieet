// Kat-dieet Edge Function voor Supabase
// Deze function dient de applicatie via Deno
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

// TypeScript interfaces
interface Feeding {
  date: string;
  timestamp: string;
  weightBefore: number;
  weightAfter: number;
  amount: number;
}

interface AppData {
  password: string | null;
  dailyLimit: number;
  fullBagWeight: number;
  emptyBagWeight: number;
  currentBagWeight: number;
  feedings: Feeding[];
}

// Initialize KV Store with error handling
let kv: Deno.Kv;
try {
  kv = await Deno.openKv();
} catch (error) {
  console.error("Failed to open KV store:", error);
  throw new Error("Database initialization failed");
}

// Initialize data structure
const initData: AppData = {
  password: null,
  dailyLimit: 50,
  fullBagWeight: 810,
  emptyBagWeight: 10,
  currentBagWeight: 810,
  feedings: []
};

// Helper functions
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function getTodayFeedings(data: AppData): Feeding[] {
  const today = getTodayString();
  return data.feedings.filter((f: Feeding) => f.date === today);
}

async function loadData(): Promise<AppData> {
  const entry = await kv.get(["kat-dieet-data"]);
  if (entry.value) {
    return entry.value as AppData;
  }
  await saveData(initData);
  return initData;
}

async function saveData(data: AppData): Promise<void> {
  await kv.set(["kat-dieet-data"], data);
}

async function authenticate(password: string | null): Promise<boolean | string> {
  const data = await loadData();
  
  if (!data.password) {
    // First time setup
    if (!password) {
      return false;
    }
    const hashedPassword = await bcrypt.hash(password);
    data.password = hashedPassword;
    await saveData(data);
    return "setup";
  } else {
    // Verify password
    if (!password) {
      return false;
    }
    return await bcrypt.compare(password, data.password);
  }
}

// Main handler
serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Serve static files
    if (pathname === '/' || pathname === '/index.html') {
      const html = await Deno.readTextFile('./public/index.html');
      return new Response(html, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      });
    }
    
    if (pathname === '/app.js') {
      const js = await Deno.readTextFile('./public/app.js');
      return new Response(js, {
        headers: { ...corsHeaders, 'Content-Type': 'application/javascript' },
      });
    }
    
    if (pathname === '/styles.css') {
      const css = await Deno.readTextFile('./public/styles.css');
      return new Response(css, {
        headers: { ...corsHeaders, 'Content-Type': 'text/css' },
      });
    }

    // API Routes
    if (pathname === '/api/check-password') {
      const data = await loadData();
      return new Response(
        JSON.stringify({ passwordSet: !!data.password }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (pathname === '/api/status' && req.method === 'POST') {
      const body = await req.json();
      const authResult = await authenticate(body.password);
      
      if (!authResult) {
        return new Response(
          JSON.stringify({ error: 'Wachtwoord vereist' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await loadData();
      const todayFeedings = getTodayFeedings(data);
      const totalEaten = todayFeedings.reduce((sum: number, f: Feeding) => sum + f.amount, 0);
      const remaining = data.dailyLimit - totalEaten;

      return new Response(
        JSON.stringify({
          currentBagWeight: data.currentBagWeight,
          dailyLimit: data.dailyLimit,
          totalEatenToday: Math.round(totalEaten * 10) / 10,
          remainingToday: Math.round(remaining * 10) / 10,
          feedings: todayFeedings
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (pathname === '/api/feed' && req.method === 'POST') {
      const body = await req.json();
      const authResult = await authenticate(body.password);
      
      if (!authResult) {
        return new Response(
          JSON.stringify({ error: 'Wachtwoord vereist' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { weightBefore, weightAfter } = body;
      
      if (typeof weightBefore !== 'number' || typeof weightAfter !== 'number') {
        return new Response(
          JSON.stringify({ error: 'Gewichten moeten nummers zijn' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (weightBefore < weightAfter) {
        return new Response(
          JSON.stringify({ error: 'Gewicht na vullen kan niet hoger zijn dan ervoor' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await loadData();
      const amount = weightBefore - weightAfter;

      const feeding = {
        date: getTodayString(),
        timestamp: new Date().toISOString(),
        weightBefore,
        weightAfter,
        amount
      };

      data.feedings.push(feeding);
      data.currentBagWeight = weightAfter;
      await saveData(data);

      const todayFeedings = getTodayFeedings(data);
      const totalEaten = todayFeedings.reduce((sum: number, f: Feeding) => sum + f.amount, 0);
      const remaining = data.dailyLimit - totalEaten;

      return new Response(
        JSON.stringify({
          success: true,
          amount,
          totalEatenToday: Math.round(totalEaten * 10) / 10,
          remainingToday: Math.round(remaining * 10) / 10
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 404 Not Found
    return new Response('Not Found', { 
      status: 404, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
