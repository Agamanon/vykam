// Importamos la función createClient del SDK oficial de Supabase.
// Esta función recibe la URL del proyecto y la clave pública (anon key)
// y devuelve un objeto "cliente" con el que hacemos consultas a la base de datos.
import { createClient } from '@supabase/supabase-js'

// Leemos las variables de entorno definidas en .env.local.
// El prefijo NEXT_PUBLIC_ hace que Next.js las exponga también en el navegador
// (sin ese prefijo, solo serían visibles en el servidor).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validación: si alguna variable no existe (está vacía o no fue definida),
// lanzamos un error en tiempo de ejecución con un mensaje claro.
// Esto evita errores silenciosos o mensajes confusos más adelante.
if (!supabaseUrl) {
  throw new Error(
    'Falta la variable de entorno NEXT_PUBLIC_SUPABASE_URL. ' +
    'Cópiala desde tu proyecto en Supabase (Settings → API) y agrégala a .env.local.'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'Falta la variable de entorno NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
    'Cópiala desde tu proyecto en Supabase (Settings → API) y agrégala a .env.local.'
  )
}

// Creamos el cliente de Supabase con la URL y la clave anónima.
// La anon key es pública y segura: Supabase usa Row Level Security (RLS)
// para controlar qué datos puede ver o modificar cada usuario.
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Exportamos el cliente como export default para usarlo en cualquier
// parte del proyecto con: import supabase from '@/lib/supabase'
export default supabase
