const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const winnerIds = [
  '3b63f3ce-e358-40b2-b15c-9759cf52389c',
  '931debfd-4f9e-41b5-aef8-0664c5158598',
  'd0ff0fca-6a97-4ee8-8399-8bcc63489bad'
];

async function main() {
  const { data, error } = await supabase
    .from('workshop_registrations')
    .select('id, name, email, phone')
    .in('id', winnerIds);

  if (error) {
    console.error('Error:', error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

main();
