import pool from '../../lib/mysql';

export const POST = async () => {
  try {
    const ahora = new Date();
    
    // Actualizar todos los registros que no tengan hora de salida
    const [result] = await pool.execute(
      'UPDATE registros SET hora_salida = ? WHERE hora_salida IS NULL',
      [ahora]
    );

    return new Response(JSON.stringify({ 
      success: true, 
      count: result.affectedRows 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error al cerrar la jornada.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
