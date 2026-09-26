import { useEffect, useState } from 'react';
import api from '../services/api';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nom_cliente: '', contacto: '', departamento: '', ciudad: '' });
  const [editandoId, setEditandoId] = useState(null);

  const cargarClientes = () => {
    setCargando(true);
    api.get('/clientes')
      .then(response => {
        setClientes(response.data);
        setCargando(false);
      })
      .catch(err => {
        setError('No se pudo cargar la lista de clientes');
        setCargando(false);
        console.error(err);
      });
  };

  useEffect(() => { cargarClientes(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const peticion = editandoId
      ? api.put(`/clientes/${editandoId}`, form)
      : api.post('/clientes', form);

    peticion
      .then(() => {
        setForm({ nom_cliente: '', contacto: '', departamento: '', ciudad: '' });
        setEditandoId(null);
        cargarClientes();
      })
      .catch(err => {
        setError('No se pudo guardar el cliente');
        console.error(err);
      });
  };

  const handleEditar = (cliente) => {
    setForm({
      nom_cliente: cliente.nom_cliente,
      contacto: cliente.contacto,
      departamento: cliente.departamento,
      ciudad: cliente.ciudad
    });
    setEditandoId(cliente.id_cliente);
  };

  const handleEliminar = (id) => {
    if (!window.confirm('¿Eliminar este cliente?')) return;
    api.delete(`/clientes/${id}`)
      .then(() => cargarClientes())
      .catch(err => {
        setError('No se pudo eliminar el cliente');
        console.error(err);
      });
  };

  const cancelarEdicion = () => {
    setForm({ nom_cliente: '', contacto: '', departamento: '', ciudad: '' });
    setEditandoId(null);
  };

  if (cargando) return <p>Cargando clientes...</p>;

  return (
    <div className="pagina-crud">
      <h2>Listado de Clientes</h2>
      {error && <p className="mensaje-error">{error}</p>}

      <form className="formulario-crud" onSubmit={handleSubmit}>
        <input name="nom_cliente" placeholder="Nombre" value={form.nom_cliente} onChange={handleChange} required />
        <input name="contacto" placeholder="Contacto" value={form.contacto} onChange={handleChange} />
        <input name="departamento" placeholder="Departamento" value={form.departamento} onChange={handleChange} />
        <input name="ciudad" placeholder="Ciudad" value={form.ciudad} onChange={handleChange} />
        <button type="submit">{editandoId ? 'Actualizar' : 'Agregar'}</button>
        {editandoId && <button type="button" onClick={cancelarEdicion}>Cancelar</button>}
      </form>

      <table className="tabla-crud">
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Contacto</th><th>Departamento</th><th>Ciudad</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id_cliente}>
              <td>{c.id_cliente}</td>
              <td>{c.nom_cliente}</td>
              <td>{c.contacto}</td>
              <td>{c.departamento}</td>
              <td>{c.ciudad}</td>
              <td>
                <button onClick={() => handleEditar(c)}>Editar</button>
                <button onClick={() => handleEliminar(c.id_cliente)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clientes;