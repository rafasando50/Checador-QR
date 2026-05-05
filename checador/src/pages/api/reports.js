import pool from '../../lib/mysql';

export const GET = async ({ url }) => {
  try {
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');
    const empleado = url.searchParams.get('empleado');

    let query = 'SELECT * FROM registros WHERE hora_entrada >= ? AND hora_entrada <= ?';
    let params = [`${start} 00:00:00`, `${end} 23:59:59`];

    if (empleado) {
      query += ' AND empleado_id = ?';
      params.push(empleado);
    }

    query += ' ORDER BY hora_entrada DESC';

    const [rows] = await pool.execute(query, params);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error en el servidor.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
