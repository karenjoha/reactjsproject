import React, { useState } from 'react';

function ModalEditar({ estado, cambiarEstado, estudiante, onEditarEstudiante }) {
  const [nombreEstudiante, setNombreEstudiante] = useState(estudiante.nombre);
  const [carreraEstudiante, setCarreraEstudiante] = useState(estudiante.carrera);

  const handleEditar = () => {
    const estudianteEditado = {
      ...estudiante,
      nombre: nombreEstudiante,
      carrera: carreraEstudiante,
    };

    if (typeof onEditarEstudiante === 'function') {
      onEditarEstudiante(estudianteEditado);
    }

    cambiarEstado(false);
  };

  return (
    <>
      {estado && (
        <div className={'fondoModal'}>
          <div className={'contenedor-modal'}>
            <form className={'formulario'}>
              <h3>Editar Estudiante</h3>
              <input
                type="text"
                className={'input-basico'}
                placeholder="Nombre Completo"
                value={nombreEstudiante}
                onChange={(e) => setNombreEstudiante(e.target.value)}
              />
              <input
                type="text"
                className={'input-basico'}
                placeholder="Carrera"
                value={carreraEstudiante}
                onChange={(e) => setCarreraEstudiante(e.target.value)}
              />
              <input
                type="button"
                className={'input-registrar'}
                value="EDITAR ESTUDIANTE"
                onClick={handleEditar}
              />
            </form>
            <button className={'boton-cerrar'} onClick={() => cambiarEstado(false)}>
              x
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ModalEditar;
