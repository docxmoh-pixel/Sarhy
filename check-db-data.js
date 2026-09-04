const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://yssrfherpwtepspdpljn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzc3JmaGVycHd0ZXBzcGRwbGpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODQxODU1MywiZXhwIjoyMDkzOTk0NTUzfQ.d5NoMC0i2UCzGLfFpJM_EVBbZhUd2Wldp6EprFqyEXo';

const supabase = createClient(supabaseUrl, supabaseKey);

const tables = [
  'products',
  'orders',
  'users',
  'seller_profiles',
  'cart_items',
  'notifications',
  'withdrawal_requests',
  'verification_requests'
];

async function checkTable(tableName) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: false })
      .limit(100);

    if (error) {
      return {
        table: tableName,
        error: error.message,
        count: 0,
        data: null
      };
    }

    return {
      table: tableName,
      count: data.length,
      data: data
    };
  } catch (err) {
    return {
      table: tableName,
      error: err.message,
      count: 0,
      data: null
    };
  }
}

function analyzeData(result) {
  const analysis = {
    table: result.table,
    count: result.count,
    isTest: false,
    patterns: [],
    sampleData: null
  };

  if (result.error) {
    analysis.error = result.error;
    return analysis;
  }

  if (result.count === 0) {
    analysis.isEmpty = true;
    return analysis;
  }

  analysis.sampleData = result.data.slice(0, 3);

  // Check for test patterns
  const testPatterns = [
    /test/i,
    /dummy/i,
    /example\.com/i,
    /fake/i,
    /sample/i,
    /demo/i,
    /placeholder/i
  ];

  const jsonStr = JSON.stringify(result.data).toLowerCase();
  testPatterns.forEach(pattern => {
    if (pattern.test(jsonStr)) {
      analysis.patterns.push(`Found pattern: ${pattern}`);
      analysis.isTest = true;
    }
  });

  // Check for sequential IDs or obvious test data
  if (result.data.length > 1) {
    const ids = result.data.map(item => item.id).filter(id => typeof id === 'number');
    if (ids.length > 1) {
      const isSequential = ids.every((id, i) => i === 0 || id === ids[i-1] + 1);
      if (isSequential) {
        analysis.patterns.push('Sequential IDs detected (possible test data)');
        analysis.isTest = true;
      }
    }
  }

  return analysis;
}

async function main() {
  console.log('=== Supabase Database Data Check ===\n');
  console.log(`URL: ${supabaseUrl}\n`);

  const results = [];

  for (const table of tables) {
    console.log(`Checking ${table}...`);
    const result = await checkTable(table);
    const analysis = analyzeData(result);
    results.push(analysis);
  }

  console.log('\n=== RESULTS ===\n');

  results.forEach(result => {
    console.log(`\n--- ${result.table} ---`);
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
    } else if (result.isEmpty) {
      console.log(`✅ Empty table (0 records)`);
    } else {
      console.log(`📊 Records: ${result.count}`);
      console.log(`🔍 Test Data: ${result.isTest ? 'YES ⚠️' : 'NO'}`);
      if (result.patterns.length > 0) {
        console.log(`📝 Patterns: ${result.patterns.join(', ')}`);
      }
      if (result.sampleData) {
        console.log(`📄 Sample Data:`);
        console.log(JSON.stringify(result.sampleData, null, 2));
      }
    }
  });

  console.log('\n=== SUMMARY ===\n');
  const testTables = results.filter(r => r.isTest);
  const emptyTables = results.filter(r => r.isEmpty);
  const errorTables = results.filter(r => r.error);
  const realDataTables = results.filter(r => !r.isTest && !r.isEmpty && !r.error);

  console.log(`Tables with test data: ${testTables.map(t => t.table).join(', ') || 'None'}`);
  console.log(`Empty tables: ${emptyTables.map(t => t.table).join(', ') || 'None'}`);
  console.log(`Tables with errors: ${errorTables.map(t => t.table).join(', ') || 'None'}`);
  console.log(`Tables with real data: ${realDataTables.map(t => t.table).join(', ') || 'None'}`);
}

main().catch(console.error);
