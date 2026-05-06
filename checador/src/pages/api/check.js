import pool from '../../lib/mysql';

export const POST = async ({ request }) => {
  try {
    const { empleado_id: qrString, tipo } = await request.json();
    const ahora = new Date();

    // El formato esperado es: ID_EMPLEADO|TIMESTAMP|EINSUR2026
    const parts = qrString.split('|');

    if (parts.length !== 3 || parts[2] !== 'EINSUR2026') {
      return new Response(JSON.stringify({ error: 'Código QR no válido o expirado.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const empleado_id = parts[0];
    
    // Buscar nombre del empleado
    let nombre = 'Empleado';
    try {
      const [empRows] = await pool.execute('SELECT nombre FROM empleados WHERE id_empleado = ?', [empleado_id]);
      if (empRows.length > 0) {
        nombre = empRows[0].nombre;
      }
    } catch (e) {
      console.error("Error al buscar empleado:", e.message);
      // Si la tabla no existe, seguimos con el nombre por defecto
    }

    if (tipo === 'Entrada') {
      // VALIDACIÓN: Evitar duplicados el mismo día
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0); // Inicio del día

      const [existente] = await pool.execute(
        'SELECT id FROM registros WHERE empleado_id = ? AND hora_entrada >= ?',
        [empleado_id, hoy]
      );

      if (existente.length > 0) {
        return new Response(JSON.stringify({ error: 'Ya has registrado tu entrada el día de hoy.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      await pool.execute(
        'INSERT INTO registros (empleado_id, hora_entrada) VALUES (?, ?)',
        [empleado_id, ahora]
      );
    } else {
      // Buscar el último registro sin salida para este empleado
      const [result] = await pool.execute(
        'UPDATE registros SET hora_salida = ? WHERE empleado_id = ? AND hora_salida IS NULL',
        [ahora, empleado_id]
      );

      
      if (result.affectedRows === 0) {
        return new Response(JSON.stringify({ error: 'No hay una entrada abierta para este empleado.' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      empleado_id, 
      nombre: nombre 
    }), {
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

