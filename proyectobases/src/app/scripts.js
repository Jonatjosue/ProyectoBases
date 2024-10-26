// Llama a la funcion loadPage al cargar la pÃ¡gina
window.onload = loadPage();

let selectedOrder = 'codigo-desc'; // Orden por defecto

// Captura la opcion de ordenamiento seleccionada
document.querySelectorAll('.sort-option').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        selectedOrder = this.getAttribute('data-order');
        document.getElementById('selectedSortText').innerText = this.textContent; // Actualiza el texto del dropdown
        submitDynamicSearch(); // Realiza la bÃºsqueda con el nuevo orden
    });
});

function loadPage() {
    loadrentas();
    loadCatalogPrimary("empleado");
    loadCatalogPrimary("vehiculo");
    loadCatalogPrimary("agencia");
}


//Carga de los catÃ¡logos en la pÃ¡gina principal
function loadCatalogPrimary(option) {
    const url = `../backend`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.exitoso) {
                switch (option) {
                    case 'vehiculo':
console.log(data);
console.log('entro al caso de vehiculo en carga de catalogo principal');
                        const select = document.getElementById('filtervehiculo');
                        select.innerHTML = ''; // Limpiar opciones previas
                        const defaultOption = document.createElement('option');
                        defaultOption.value = ''; // Valor nulo
                        defaultOption.textContent = 'Todo';
                        select.appendChild(defaultOption);
                        data.data.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.CODIGOVEHICULO;
                            option.text = item.DETALLEVEHICULO;
                            select.appendChild(option);
                        });
                        break;
                    case 'empleado':
                        const select1 = document.getElementById('filterempleado');
                        select1.innerHTML = ''; // Limpiar opciones previas
                        const defaultOption1 = document.createElement('option');
                        defaultOption1.value = ''; // Valor nulo
                        defaultOption1.textContent = 'Todo';
                        select1.appendChild(defaultOption1);
                        data.data.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.CODIGOEMPLEADO;
                            option.text = item.NOMBREEMPLEADO;
                            select1.appendChild(option);
                        });
                        break;
                    case 'agencia':
                        const select2 = document.getElementById('filterAgency');
                        select2.innerHTML = ''; // Limpiar opciones previas
                        const defaultOption2 = document.createElement('option');
                        defaultOption2.value = ''; // Valor nulo
                        defaultOption2.textContent = 'Todo';
                        select2.appendChild(defaultOption2);
                        data.data.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.CODIGOAGENCIA;
                            option.text = item.NOMBREAGENCIA;
                            select2.appendChild(option);
                        });
                        break;
                    default:
                        break;
                }

            }
        })
        .catch(error => console.error('Error al cargar vehiculo:', error));
}

// Funcion para la creacion, modificacion y eliminacion de renta. Creacion para vehiculo, clasificacion y tipo empresa.
function submitForm(formId, endpoint, action) {
    const form = document.getElementById(formId);
    const formData = new FormData(form);
    const url = `/`;

    let isValid = true; // Inicialmente se asume que es vÃ¡lido
    let requiredFields = []; // Array para los campos requeridos especÃ­ficos del endpoint

    // Definir campos requeridos para cada endpoint
    switch (endpoint) {
        case 'renta':
            switch (action) {
                case 'create':
                    requiredFields = ['descripcion', 'linkrenta', 'fecha', 'tema', 'empleado'];
                    break;
                case 'update':
                    requiredFields = ['CODIGOCLIENTE', 'descripcion', 'linkrenta', 'fecha', 'tema', 'empleado'];
                    break;
                case 'delete':
                    console.log('Caso de eliminacion seleccionado.');
                    break;

            }
            break;
        case 'vehiculo':
            requiredFields = ['CODIGOVEHICULO', 'DETALLEVEHICULO'];
            break;
        case 'empleado':
            requiredFields = ['NOMBREEMPLEADO'];
            break;
        case 'agencia':
            requiredFields = ['NOMBREAGENCIA'];
            break;
        default:
            console.error(`Endpoint desconocido: ${endpoint}`);
            isValid = false;
            break;
    }

    // Validar que los campos requeridos no estÃ©n vacÃ­os
    requiredFields.forEach(field => {
        if (!formData.get(field)) {
            console.error(`El campo ${field} es requerido y estÃ¡ vacÃ­o.`);
            isValid = false;
        }
    });

    if (!isValid) {
        alert('Por favor, complete todos los campos requeridos.');
        return; // Salir de la funcion si hay campos vacÃ­os
    }

    // Realizar la solicitud fetch si la validacion es exitosa
    fetch(url, {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Respuesta de Red, error.');
            }
            return response.json();
        })
        .then(data => {
            if (data.exitoso) {
                form.reset(); // Limpiar los campos
                const modal = bootstrap.Modal.getInstance(form.closest('.modal'));
                if (modal) {
                    modal.hide();
                }
                loadPage(); // Funcion para recargar los rentas en la tabla
                alert(`Accion ${action} completada con Ã©xito en ${endpoint}.`);
            } else {
                alert(data.error);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function submitOther(formId, endpoint, action) {
    // Obtener el valor del elemento con el ID proporcionado
    const idValue = document.getElementById(formId).value;

    // Crear la URL del endpoint PHP
    const url = `/`;

    // Crear un objeto con los datos que deseas enviar
    const data = new URLSearchParams();
    data.append('CODIGOCLIENTE', idValue);  // Cambia 'id' por el nombre del campo que el backend espera

    // Realizar la solicitud fetch si la validacion es exitosa
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',  // Establecer el tipo de contenido
        },
        body: data.toString()  // Enviar los datos codificados
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Respuesta de red con error.');
            }
            return response.json();
        })
        .then(data => {
            if (data.exitoso) {
                loadrentas(); // Funcion para recargar los rentas en la tabla
                alert(`Accion ${action} completada con Ã©xito en ${endpoint}.`);
            } else {
                alert(data.error);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}



// Funcion para pintar los resultados en la tabla de la pÃ¡gina principal
function pintarResultadosEnTabla(resultados) {
    const tableBody = document.getElementById('rentaTableBody');
    tableBody.innerHTML = ''; // Limpia la tabla antes de llenarla

    resultados.forEach(resultado => {
        const row = document.createElement('tr');
        row.innerHTML = `
                            <td>
                                <!-- MenÃº desplegable con tres puntitos -->
                                <div class="dropdown">
                                    <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <li><a class="dropdown-item" href="#" onclick="editrenta(this)">Modificar</a>
                                        </li>
                                        <li><a class="dropdown-item" href="#" onclick="deleterenta(this)">Eliminar</a>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        <td>${resultado.CODIGOCLIENTE}</td>
                        <td>${resultado.DESCRIPCION}</td>
                        <td th class = "date">${resultado.FECHA}</td>
                        <td>${resultado.NOMBREEMPLEADO}</td>
                        <td>${resultado.NOMBREAGENCIA ? resultado.NOMBREAGENCIA : 'No aplica'}</td>
                        <td>${resultado.DETALLEVEHICULO ? resultado.DETALLEVEHICULO : 'No aplica'}</td>
                    `;
        tableBody.appendChild(row);
    });
}

// Funcion para cargar opciones dinÃ¡micas en los selectores
function cargarOpcionesFiltros() {
    loadAdvancedempleado();
    loadAdvancedvehiculo();
    loadAdvancedAgency();
}

//-------------------------------------------------------
// Funcion para cargar los rentas y llenar la tabla
function loadrentas() {
    const url = '../backend';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            if (data.exitoso) {
                const tableBody = document.getElementById('rentaTableBody');
                tableBody.innerHTML = ''; // Limpia la tabla antes de llenarla

                data.data.forEach(renta => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                            <td>
                                <!-- MenÃº desplegable con tres puntitos -->
                                <div class="dropdown">
                                    <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton"
                                        data-bs-toggle="dropdown" aria-expanded="false">
                                        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                                    </button>
                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <li><a class="dropdown-item" href="#" onclick="editrenta(this)">Modificar</a>
                                        </li>
                                        <li><a class="dropdown-item" href="#" onclick="deleterenta(this)">Eliminar</a>
                                        </li>
                                    </ul>
                                </div>
                            </td>
                        <td>${renta.CODIGOAGENCIA}</td>
                        <td>${renta.DESCRIPCION}</td>
                        <td>${renta.NOMBREAGENCIA ? renta.NOMBREAGENCIA : 'No aplica'}</td>
                        <td>${renta.DETALLEVEHICULO ? renta.DETALLEVEHICULO : 'No aplica'}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                console.error('Error al cargar los rentas:', data.error);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

// Funcion para editar el renta
function editCliente(link) {
    // ObtÃ©n el codigo del renta desde la fila
    const row = link.closest('tr');
    const cells = row.querySelectorAll('td');

    const data = {
        CODIGOCLIENTE: cells[1].textContent // AsegÃºrate de que el codigo estÃ© en la segunda columna
    };

    const CODIGOCLIENTE = data.CODIGOCLIENTE;
    const url = '../backend';

    // Realizo la solicitud de bÃºsqueda del renta con el codigo proporcionado
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // Seguimos usando form-urlencoded
        },
        body: new URLSearchParams({ CODIGOCLIENTE }) // Creamos los parÃ¡metros del formulario
    })
        .then(response => response.json()) // AsegÃºrate de que la respuesta sea JSON
        .then(jsonData => {
            try {
                if (jsonData.exitoso && jsonData.data.length > 0) {
                    var nuevoModal = new bootstrap.Modal(document.getElementById('editrentaModal'));
                    nuevoModal.show();
                    // Maneja el Ã©xito y actualiza el modal
                    const renta = jsonData.data[0]; // Suponiendo que siempre habrÃ¡ un solo renta con el ID dado
                    llenado(renta); // Llenar los campos del modal con la informacion del renta
                } else {
                    console.error("Error al buscar:", jsonData.error || 'No se encontraron datos.');
                    clearTable(); // Limpia la tabla si hay un error
                    alert(`El renta con ID ${CODIGOCLIENTE} no existe en la base de datos. \nNo se puede modificar.`);
                    clearModalFields(formId); // Limpia los campos del modal si no se encuentra el renta
                }
            } catch (error) {
                console.error("Error de parseo JSON:", error);
            }
        })
        .catch(error => console.error("Error en la solicitud:", error));
}



function llenado(data) {
    document.getElementById('editCoderenta').value = data.CODIGOCLIENTE;
    document.getElementById('editDescription').value = data.DESCRIPCION;
    document.getElementById('editDate').value = data.FECHA;
    editSelectempleados(data.CODIGOEMPLEADO);
    editSelectvehiculos(data.CODIGOVEHICULO);
    editSelectTypes(data.CODIGOAGENCIA);
}

function deleterenta(link) {
    // ObtÃ©n el codigo del renta desde la fila
    const row = link.closest('tr');
    const cells = row.querySelectorAll('td');

    const data = {
        CODIGOCLIENTE: cells[1].textContent
    };
    var verifyPasswordModal2 = new bootstrap.Modal(document.getElementById('VerifyPasswordModal2'));
    document.getElementById('rentaCodeToDelete').value = data.CODIGOCLIENTE;
    document.getElementById('rentaCodeToDelete').textContent = data.CODIGOCLIENTE;

    verifyPasswordModal2.show();

}

// // Funcion para cargar la tabla en creacion de vehiculo
function vehiculoTables() {
    const url = '../backend';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            if (data.exitoso) {
                const tableBody = document.getElementById('vehiculoTable')
                    .getElementsByTagName('tbody')[0];
                tableBody.innerHTML = ''; // Limpia la tabla antes de llenarla

                data.data.forEach(renta => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${renta.CODIGOVEHICULO}</td>
                        <td>${renta.DETALLEVEHICULO}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                console.error('Error al cargar los datos:', data.error);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}
// Funcion para cargar la tabla en creacion de empleado
function empleadosTables() {
    const url = '../backend';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            if (data.exitoso) {
                const tableBody = document.getElementById('empleadoTable')
                    .getElementsByTagName('tbody')[0];
                tableBody.innerHTML = ''; // Limpia la tabla antes de llenarla

                data.data.forEach(renta => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${renta.CODIGOEMPLEADO}</td>
                        <td>${renta.NOMBREEMPLEADO}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                console.error('Error al cargar los datos:', data.error);
            }

        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}
// Funcion para cargar la tabla en creacion de Tipo Empresa
function agenciasTables() {
    const url = '../backend';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            if (data.exitoso) {
                const tableBody = document.getElementById('AgencyTable')
                    .getElementsByTagName('tbody')[0];
                tableBody.innerHTML = ''; // Limpia la tabla antes de llenarla

                data.data.forEach(renta => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${renta.CODIGOAGENCIA}</td>
                        <td>${renta.NOMBREAGENCIA}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                console.error('Error al cargar los datos:', data.error);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}
// Funcion para actualizar la tabla en el modal de eliminacion
function updateDeleterentaTable(renta) {
    const tableHtml = `
        <tr>
            <td>${renta.CODIGOCLIENTE}</td>
            <td>${renta.DESCRIPCION}</td>
            <td>${renta.NOMBREEMPLEADO}</td>
            <td>${renta.NOMBREAGENCIA}</td>
            <td>${renta.FECHA}</td>
            <td>${renta.DETALLEVEHICULO}</td>
        </tr>
    `;
    document.getElementById('deleterentaTable').innerHTML = tableHtml;
}
// Funcion para manejar la respuesta del servidor y actualizar el modal
function handlerentaData(renta, formId) {
    if (formId === 'updaterentaModal') {
        // Llama a la funcion para llenar los campos del modal
        populateModalWithData(renta);
    } else if (formId === 'deleterentaModal') {
        // Actualiza la tabla para el modal de eliminacion
        updateDeleterentaTable(renta);
    }
}
// Funcion para buscar un renta por ID en modal Modificar
function searchrentaById(id, formId) {
    const CODIGOCLIENTE = document.getElementById(id).value;
    const url = `../backend`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ CODIGOCLIENTE })
    })
        .then(response => response.text())
        .then(data => {
            try {
                const jsonData = JSON.parse(data);
                if (jsonData.exitoso && jsonData.data.length > 0) {
                    // Maneja el Ã©xito y actualiza el modal
                    const renta = jsonData.data[0]; // Suponiendo que siempre habrÃ¡ un solo renta con el ID dado
                    handlerentaData(renta, formId);
                } else {
                    console.error("Error al buscar:", jsonData.error || 'No se encontraron datos.');
                    clearTable(); // Limpia la tabla si hay un error
                    alert(`El renta con ID ${CODIGOCLIENTE} no existe en la base de datos. \n No se puede modificar.`);
                    clearModalFields(formId);
                }
            } catch (error) {
                console.error("Error de parseo JSON:", error);
            }
        })
        .catch(error => console.error("Error en la solicitud:", error));
}

// Funcion para pintal los datos del modal, en este caso, aplica Ãºnicamente para modificar renta.
function populateModalWithData(renta) {
    // Rellena los campos del formulario con los datos del renta
    document.getElementById('updateCoderenta').value = renta.CODIGOCLIENTE;
    document.getElementById('updateDescription').value = renta.DESCRIPCION;
    document.getElementById('updateDate').value = renta.FECHA;
    document.getElementById('updateempleado').value = renta.CODIGOEMPLEADO;
    document.getElementById('updateAgency').value = renta.CODIGOAGENCIA;
    document.getElementById('updatevehiculo').value = renta.CODIGOVEHICULO;

    // Actualiza la tabla de previsualizacion
    updateTableWithData([renta]);
}

// Actualizacion de la tabla al encontrar el renta a modificar.
function updateTableWithData(data) {
    const tableBody = document.querySelector('#vista_rentaTable tbody');
    tableBody.innerHTML = data.map(renta => `
        <tr>
            <td>${renta.CODIGOCLIENTE}</td>
            <td>${renta.DESCRIPCION}</td>
            <td>${renta.NOMBREEMPLEADO}</td>
            <td>${renta.NOMBREAGENCIA || 'N/A'}</td>
            <td>${renta.FECHA}</td>
            <td>${renta.DETALLEVEHICULO || 'N/A'}</td>
        </tr>
    `).join('');
}
// Limpia la tabla de los datos que ya tiene pintado. Solo aplica a la tabla en el modal de Modificar renta.
function clearTables() {
    const tableBody = document.querySelector('#vista_rentaTable tbody');
    tableBody.innerHTML = '';
}
// Funcion para limpiar la tabla
function clearTable() {
    const tableBody = document.querySelector('#vista_rentaTable tbody');
    tableBody.innerHTML = '<tr><td colspan="9" class="text-center">No se encontraron resultados.</td></tr>';
}

//------------------------------------------------------------------------
// Llamar a las funciones al abrir el modal
document.getElementById('createrentaModal').addEventListener('show.bs.modal', () => {
    loadempleados();
    loadagencias();
    loadvehiculos();
});
document.getElementById('updaterentaModal').addEventListener('show.bs.modal', () => {
    loadUpdateempleados();
    loadUpdateagencias();
    loadUpdatevehiculos();
});
document.getElementById('createvehiculoModal').addEventListener('show.bs.modal', () => {
    vehiculosTables();
});
document.getElementById('createempleadoModal').addEventListener('show.bs.modal', () => {
    empleadosTables();
});
document.getElementById('createAgencyModal').addEventListener('show.bs.modal', () => {
    agenciasTables();
});
document.getElementById('searchModal').addEventListener('show.bs.modal', () => {
    cargarOpcionesFiltros();
});

// Abrir modal de actualizacion con datos llamado desde EDIT
function openEditrentaModal2(rentaId) {
    // Obtener los datos del renta por su ID
    fetch(`/backend`)
        .then(response => response.json())
        .then(data => {
            // Llenar el formulario con los datos del renta
            document.getElementById('editCODIGOCLIENTE').value = data.CODIGOCLIENTE;
            document.getElementById('editDescripcion').value = data.DESCRIPCION;
            document.getElementById('editFecha').value = data.FECHA;

            // Mostrar el modal
            const editrentaModal = new bootstrap.Modal(document.getElementById('editrentaModal'));
            editrentaModal.show();
        })
        .catch(error => console.error('Error al cargar los datos del renta:', error));
}
//-------------------------------------------------------------------------
// Funcion para cargar opciones de Clasificacion
function loadempleados() {
    const url = '../backend';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.exitoso) {
                const select = document.getElementById('rentaempleado');
                select.innerHTML = ''; // Limpiar opciones previas
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.CODIGOEMPLEADO;
                    option.text = item.NOMBREEMPLEADO;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar empleadoes:', error));
}
// Funcion para cargar opciones de vehiculo
function loadvehiculos() {
    const url = '../backend';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.exitoso) {
                const select = document.getElementById('rentavehiculo');
                select.innerHTML = ''; // Limpiar opciones previas
                const defaultOption = document.createElement('option');
                defaultOption.value = ''; // Valor nulo
                defaultOption.textContent = 'No aplica';
                select.appendChild(defaultOption);
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.CODIGOVEHICULO;
                    option.text = item.DETALLEVEHICULO;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar vehiculo:', error));
}// Funcion para cargar opciones de Tipo Empresa
function loadagencias() {
    const url = '../backend';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.exitoso) {
                const select = document.getElementById('rentaAgency');
                select.innerHTML = ''; // Limpiar opciones previas
                const defaultOption = document.createElement('option');
                defaultOption.value = ''; // Valor nulo
                defaultOption.textContent = 'No aplica';
                select.appendChild(defaultOption);
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.CODIGOAGENCIA;
                    option.text = item.NOMBREAGENCIA;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar Tipo Empresa:', error));
}
// Funcion para cargar opciones de Clasificacion UPDATE
function loadUpdateempleados() {
    fetch('..backend')
        .then(response => response.json())
        .then(data => {
            if (data.exitoso) {
                const select = document.getElementById('updateempleado');
                select.innerHTML = ''; // Limpiar opciones previas
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.CODIGOEMPLEADO;
                    option.text = item.NOMBREEMPLEADO;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar empleadoes:', error));
}
// Funcion para cargar opciones de vehiculo UPDATE
function loadUpdatevehiculos() {
    fetch('../backend')
        .then(response => response.json())
        .then(data => {
            if (data.exitoso) {
                const select = document.getElementById('updatevehiculo');
                select.innerHTML = ''; // Limpiar opciones previas
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.CODIGOVEHICULO;
                    option.text = item.DETALLEVEHICULO;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar vehiculos:', error));
}// Funcion para cargar opciones de Tipo Empresa UPDATE
function loadUpdateagencias() {
    const url = '../backend';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.exitoso) {
                const select = document.getElementById('updateAgency');
                select.innerHTML = ''; // Limpiar opciones previas
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.CODIGOAGENCIA;
                    option.text = item.NOMBREAGENCIA;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar Tipo de Empresa:', error));
}
// Funcion para cargar opciones de Clasificacion SEARCH
function loadAdvancedempleado() {
    fetch('../backend')
        .then(response => response.json())
        .then(data => {
            if (data.exitoso) {
                const select = document.getElementById('filterempleado');
                select.innerHTML = ''; // Limpiar opciones previas
                const defaultOption = document.createElement('option');
                defaultOption.value = ''; // Valor nulo
                defaultOption.textContent = '... Seleccione una empleado';
                select.appendChild(defaultOption);
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.CODIGOEMPLEADO;
                    option.text = item.NOMBREEMPLEADO;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar empleadoes:', error));
}
// Funcion para cargar opciones de vehiculo SEARCH
function loadAdvancedvehiculo() {
    fetch('../backend')
        .then(response => response.json())
        .then(data => {
            if (data.exitoso) {
                const select = document.getElementById('filtervehiculo');
                select.innerHTML = ''; // Limpiar opciones previas
                const defaultOption = document.createElement('option');
                defaultOption.value = ''; // Valor nulo
                defaultOption.textContent = '... Seleccione un vehiculo';
                select.appendChild(defaultOption);
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.CODIGOVEHICULO;
                    option.text = item.DETALLEVEHICULO;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar vehiculo:', error));
}// Funcion para cargar opciones de Tipo Empresa SEARCH
function loadAdvancedAgency() {
    const url = '../backend';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.exitoso) {
                const select = document.getElementById('filterAgency');
                select.innerHTML = ''; // Limpiar opciones previas
                const defaultOption = document.createElement('option');
                defaultOption.value = ''; // Valor nulo
                defaultOption.textContent = '... Seleccione un Tipo de Empresa';
                select.appendChild(defaultOption);
                data.data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.CODIGOAGENCIA;
                    option.text = item.NOMBREAGENCIA;
                    select.appendChild(option);
                });
            }
        })
        .catch(error => console.error('Error al cargar agencia:', error));
}
//------------------------------------------------------
// Funcion para limpiar el modal que se especifique
function clearModalFields(modalId) {
    // ObtÃ©n el modal por su ID
    const modal = document.getElementById(modalId);

    if (!modal) {
        console.warn(`No se encontro el modal con ID: ${modalId}`);
        return;
    }

    // Encuentra todos los inputs, textareas y selects dentro del modal
    const inputs = modal.querySelectorAll('input, textarea, select');

    // Recorre todos los campos y lÃ­mpialos
    inputs.forEach((input) => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false; // Desmarcar checkboxes y radios
        } else {
            input.value = ''; // Limpiar el resto de los campos
        }
    });
}

//-----------------------------------------------------
// Manejar el boton de eliminar

function showVerifyPasswordModal() {
    var verifyPasswordModal = new bootstrap.Modal(document.getElementById('VerifyPasswordModal'));
    verifyPasswordModal.show();
}


function verifyPassword() {
    const url = '../backend';
    var password = document.getElementById('verifyPassword').value;
    // Realizar la solicitud para verificar la contraseÃ±a
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            action: 'verify_password',
            password: password
        })
    }).then(response => response.json())
        .then(data => {
            if (data.exitoso) {
                alert('ContraseÃ±a Correcta.');

                submitForm('deleterentaForm', 'renta', 'delete');
                clearModalFields('VerifyPasswordModal');
                $('#VerifyPasswordModal').modal('hide');

            } else {
                alert('ContraseÃ±a incorrecta. IntÃ©ntalo de nuevo.');
                clearModalFields('VerifyPasswordModal');

            }
        })
        .catch(error => {
            console.error('Error en la solicitud fetch:', error);
        });
}

function verifyPassword2() {
    const url = '../backend';
    var password = document.getElementById('verifyPassword2').value;
    // Realizar la solicitud para verificar la contraseÃ±a
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            action: 'verify_password',
            password: password
        })
    }).then(response => response.json())
        .then(data => {
            if (data.exitoso) {
                submitOther('rentaCodeToDelete', 'renta', 'delete');
                clearModalFields('VerifyPasswordModal2');
                $('#VerifyPasswordModal2').modal('hide');

            } else {
                alert('ContraseÃ±a incorrecta. IntÃ©ntalo de nuevo.');
                clearModalFields('VerifyPasswordModal2');


            }
        })
        .catch(error => {
            console.error('Error en la solicitud fetch:', error);
        });
}


function showVerifyPasswordPanel2() {
    // Oculta el modal de eliminacion
    //$('#deleterentaModal').modal('hide');

    // Muestra el panel de confirmacion
    $('#verifyPasswordPanel').removeClass('d-none');
    console.log("XD");
}

function hideVerifyPasswordPanel2() {
    // Oculta el panel de confirmacion
    $('#verifyPasswordPanel').addClass('d-none');
}

//-----------
function showConfirmDeleteAlert2() {
    // Oculta el modal de eliminacion
    $('#deleterentaModal').modal('hide');

    // Muestra el panel de alerta
    document.getElementById('confirmDeleteAlert').classList.remove('d-none');
}

function hideConfirmDeleteAlert2() {
    // Oculta el panel de alerta
    document.getElementById('confirmDeleteAlert').classList.add('d-none');
}
