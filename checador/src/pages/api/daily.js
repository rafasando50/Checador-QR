import pool from '../../lib/mysql';

export const GET = async () => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const [rows] = await pool.execute(
      'SELECT * FROM registros WHERE hora_entrada >= ? ORDER BY hora_entrada DESC',
      [hoy]
    );

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
