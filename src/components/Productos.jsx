import { useEffect, useState } from 'react';
import api from '../services/api';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nom_producto: '', cantidad: '', precio: '' });
  const [editandoId, setEditandoId] = useState(null);

  const cargarProductos = () => {
    setCargando(true);
    api.get('/productos')
      .then(response => {
        setProductos(response.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de productos');
        setCargando(false);
        console.error(err);
      });
  };

  useEffect(() => { cargarProductos(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const peticion = editandoId
      ? api.put(`/productos/${editandoId}`, form)
      : api.post('/productos', form);

    peticion
      .then(() => {
        setForm({ nom_producto: '', cantidad: '', precio: '' });
        setEditandoId(null);
        cargarProductos();
      })
      .catch(err => {
        setError('No se pudo guardar el producto');
        console.error(err);
      });
  };

  const handleEditar = (producto) => {
    setForm({
      nom_producto: producto.nom_producto,
      cantidad: producto.cantidad,
      precio: producto.precio
    });
    setEditandoId(producto.id_producto);
  };

  const handleEliminar = (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    api.delete(`/productos/${id}`)
      .then(() => cargarProductos())
      .catch(err => {
        setError('No se pudo eliminar el producto');
        console.error(err);
      });
  };

  const cancelarEdicion = () => {
    setForm({ nom_producto: '', cantidad: '', precio: '' });
    setEditandoId(null);
  };

  if (cargando) return <p>Cargando productos...</p>;

  return (
    <div className="pagina-crud">
      <h2>Listado de Productos</h2>
      {error && <p className="mensaje-error">{error}</p>}

      <form className="formulario-crud" onSubmit={handleSubmit}>
        <input name="nom_producto" placeholder="Nombre del producto" value={form.nom_producto} onChange={handleChange} required />
        <input name="cantidad" type="number" placeholder="Cantidad" value={form.cantidad} onChange={handleChange} required />
        <input name="precio" type="number" step="0.01" placeholder="Precio" value={form.precio} onChange={handleChange} required />
        <button type="submit">{editandoId ? 'Actualizar' : 'Agregar'}</button>
        {editandoId && <button type="button" onClick={cancelarEdicion}>Cancelar</button>}
      </form>

      <table className="tabla-crud">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Cantidad</th><th>Precio</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id_producto}>
              <td>{p.id_producto}</td>
              <td>{p.nom_producto}</td>
              <td>{p.cantidad}</td>
              <td>{p.precio}</td>
              <td>
                <button onClick={() => handleEditar(p)}>Editar</button>
                <button onClick={() => handleEliminar(p.id_producto)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Productos;