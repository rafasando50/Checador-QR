import pool from '../../lib/mysql';

export const POST = async ({ request }) => {
  try {
    const { empleado_id, tipo } = await request.json();
    const ahora = new Date();

    if (tipo === 'Entrada') {
      await pool.execute(
        'INSERT INTO registros (empleado_id, hora_entrada) VALUES (?, ?)',
        [empleado_id, ahora]
      );
    } else {
      // Buscar el último registro sin salida para este empleado
      const [rows] = await pool.execute(
        'UPDATE registros SET hora_salida = ? WHERE empleado_id = ? AND hora_salida IS NULL',
        [ahora, empleado_id]
      );
      
      if (rows.affectedRows === 0) {
        return new Response(JSON.stringify({ error: 'No hay una entrada abierta para este empleado.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
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
