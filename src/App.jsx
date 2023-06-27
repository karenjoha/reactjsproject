import React, { Fragment, useState, useRef, useEffect } from 'react';
import Modal from './componentes/modal';
import ModalEditar from './componentes/modalEditar';
import './App.css';
import { BiSearchAlt } from 'react-icons/bi';

function App() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [estudianteActivo, setEstudiantesActivos] = useState(0);
  const [estudianteRegistrado, setEstudiantesRegistrados] = useState(0);
  const [estadoModal, cambiarEstadoModal] = useState(false);
  const [estadoModalEditar, cambiarEstadoModalEditar] = useState(false);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState(null);
  const [buscadorActivo, setBuscadorActivo] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const inputRef = useRef(null);

  const handleClickIcono = () => {
    setBuscadorActivo(true);
    inputRef.current.focus();
  };

  useEffect(() => {
    const estudiantesGuardados = JSON.parse(localStorage.getItem('estudiantes'));

    if (estudiantesGuardados && estudiantesGuardados.length > 0) {
      setEstudiantes(estudiantesGuardados);

      const estudiantesActivos = estudiantesGuardados.filter((estudiante) => estudiante.activo);
      setEstudiantesActivos(estudiantesActivos.length);
      setEstudiantesRegistrados(estudiantesGuardados.length);
    }
  }, []);

  const guardarEstudiantesLocalStorage = () => {
    localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
  };

  const registrarEstudiante = (estudiante) => {
    const nuevoEstudiante = {
      ...estudiante,
      id: Date.now().toString(),
      activo: true,
    };

    setEstudiantes([...estudiantes, nuevoEstudiante]);
    setEstudiantesActivos(estudianteActivo + 1);
    setEstudiantesRegistrados(estudianteRegistrado + 1);
  };

  const toggleEstadoEstudiante = (id) => {
    const estudiantesActualizados = estudiantes.map((estudiante) => {
      if (estudiante.id === id) {
        return {
          ...estudiante,
          activo: !estudiante.activo,
        };
      }
      return estudiante;
    });

    setEstudiantes(estudiantesActualizados);

    const estudiantesActivos = estudiantesActualizados.filter((estudiante) => estudiante.activo);
    setEstudiantesActivos(estudiantesActivos.length);
  };

  const eliminarEstudiante = (id) => {
    const estudiantesActualizados = estudiantes.filter((estudiante) => estudiante.id !== id);

    setEstudiantes(estudiantesActualizados);
    setEstudiantesRegistrados(estudianteRegistrado - 1);

    const estudiantesActivos = estudiantesActualizados.filter((estudiante) => estudiante.activo);
    setEstudiantesActivos(estudiantesActivos.length);
  };

  const editarEstudiante = (estudiante) => {
    const estudiantesActualizados = estudiantes.map((item) => {
      if (item.id === estudiante.id) {
        return {
          ...item,
          nombre: estudiante.nombre,
          carrera: estudiante.carrera,
        };
      }
      return item;
    });

    setEstudiantes(estudiantesActualizados);
  };

  useEffect(() => {
    guardarEstudiantesLocalStorage();
  }, [estudiantes]);

  const estudiantesFiltrados = estudiantes.filter((estudiante) => {
    const nombre = estudiante.nombre.toLowerCase();
    const carrera = estudiante.carrera.toLowerCase();
    const textoBusqueda = busqueda.toLowerCase();
    return nombre.includes(textoBusqueda) || carrera.includes(textoBusqueda);
  });

  const abrirModalEditar = (estudiante) => {
    setEstudianteSeleccionado(estudiante);
    cambiarEstadoModalEditar(true);
  };

  const cerrarModalEditar = () => {
    cambiarEstadoModalEditar(false);
    setEstudianteSeleccionado(null);
  };

  return (
    <Fragment>
      <div className="head">
        <h1 className="titulo">
          HAY {estudianteActivo} ESTUDIANTES ACTIVOS DE {estudianteRegistrado} REGISTRADOS
        </h1>
      </div>
      <div className="buscador">
        <div className={`barra ${buscadorActivo ? 'activo' : ''}`}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar Estudiante"
            onFocus={() => setBuscadorActivo(true)}
            onBlur={() => setBuscadorActivo(false)}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <div className="icono-busqueda" onClick={handleClickIcono}>
            <BiSearchAlt />
          </div>
        </div>
      </div>
      <div className="tabla">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Carrera</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estudiantes.length > 0 ? (
              estudiantesFiltrados.length > 0 ? (
                estudiantesFiltrados.map((estudiante) => (
                  <tr key={estudiante.id} className={estudiante.activo ? 'registrado' : 'inactivo'}>
                    <td>{estudiante.nombre}</td>
                    <td>{estudiante.carrera}</td>
                    <td>
                      {estudiante.activo ? (
                        <button className="estado" onClick={() => toggleEstadoEstudiante(estudiante.id)}>
                          Activo
                        </button>
                      ) : (
                        <button className="estado" onClick={() => toggleEstadoEstudiante(estudiante.id)}>
                          Inactivo
                        </button>
                      )}
                    </td>
                    <td>
                      <button className="estado" onClick={() => abrirModalEditar(estudiante)}>
                        Editar
                      </button>
                      <button className="estado" onClick={() => eliminarEstudiante(estudiante.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay estudiantes registrados que coincidan con la búsqueda.</td>
                </tr>
              )
            ) : (
              <tr>
                <td colSpan="4">No hay estudiantes registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        <button className="boton-abrir" onClick={() => cambiarEstadoModal(true)}>
          +
        </button>
        <Modal estado={estadoModal} cambiarEstado={cambiarEstadoModal} onRegistroEstudiante={registrarEstudiante} />
        {estadoModalEditar && (
          <ModalEditar
            estado={estadoModalEditar}
            cambiarEstado={cerrarModalEditar}
            estudiante={estudianteSeleccionado}
            onEditarEstudiante={editarEstudiante}
          />
        )}
      </div>
    </Fragment>
  );
}

export default App;
