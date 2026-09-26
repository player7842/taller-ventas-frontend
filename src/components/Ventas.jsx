import { useEffect, useState } from 'react';
import api from '../services/api';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ id_cliente: '', fecha_venta: '', total: '', estado: '' });
  const [editandoId, setEditandoId] = useState(null);

  const cargarVentas = () => {
    setCargando(true);
    api.get('/ventas')
      .then(response => {
        setVentas(response.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de ventas');
        setCargando(false);
        console.error(err);
      });
  };

  useEffect(() => { cargarVentas(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const peticion = editandoId
      ? api.put(`/ventas/${editandoId}`, form)
      : api.post('/ventas', form);

    peticion
      .then(() => {
        setForm({ id_cliente: '', fecha_venta: '', total: '', estado: '' });
        setEditandoId(null);
        cargarVentas();
      })
      .catch(err => {
        setError('No se pudo guardar la venta');
        console.error(err);
      });
  };

  const handleEditar = (venta) => {
    setForm({
      id_cliente: venta.id_cliente,
      fecha_venta: venta.fecha_venta ? venta.fecha_venta.substring(0, 10) : '',
      total: venta.total,
      estado: venta.estado
    });
    setEditandoId(venta.id_venta);
  };

  const handleEliminar = (id) => {
    if (!window.confirm('¿Eliminar esta venta?')) return;
    api.delete(`/ventas/${id}`)
      .then(() => cargarVentas())
      .catch(err => {
        setError('No se pudo eliminar la venta');
        console.error(err);
      });
  };

  const cancelarEdicion = () => {
    setForm({ id_cliente: '', fecha_venta: '', total: '', estado: '' });
    setEditandoId(null);
  };

  if (cargando) return <p>Cargando ventas...</p>;

  return (
    <div className="pagina-crud">
      <h2>Listado de Ventas</h2>
      {error && <p className="mensaje-error">{error}</p>}

      <form className="formulario-crud" onSubmit={handleSubmit}>
        <input name="id_cliente" type="number" placeholder="ID Cliente" value={form.id_cliente} onChange={handleChange} required />
        <input name="fecha_venta" type="date" value={form.fecha_venta} onChange={handleChange} required />
        <input name="total" type="number" step="0.01" placeholder="Total" value={form.total} onChange={handleChange} required />
        <input name="estado" placeholder="Estado" value={form.estado} onChange={handleChange} required />
        <button type="submit">{editandoId ? 'Actualizar' : 'Agregar'}</button>
        {editandoId && <button type="button" onClick={cancelarEdicion}>Cancelar</button>}
      </form>

      <table className="tabla-crud">
        <thead>
          <tr><th>ID</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {ventas.map(v => (
            <tr key={v.id_venta}>
              <td>{v.id_venta}</td>
              <td>{v.nom_cliente}</td>
              <td>{v.fecha_venta ? v.fecha_venta.substring(0, 10) : ''}</td>
              <td>{v.total}</td>
              <td>{v.estado}</td>
              <td>
                <button onClick={() => handleEditar(v)}>Editar</button>
                <button onClick={() => handleEliminar(v.id_venta)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Ventas;