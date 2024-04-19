const BASE_URL = "http://127.0.0.1:5000/api"
const fetchExisting = async () => {
    let url = `${BASE_URL}/veiculos`;
    fetch(url, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        data.veiculos.forEach(veiculo => appendVehicle(veiculo))
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

const appendVehicle = (veiculo) => {
    let dropDown = document.getElementById("veiculos");
    let opt = document.createElement("option");
    opt.value = veiculo.placa;
    opt.innerHTML = `${veiculo.marca} ${veiculo.modelo} ${veiculo.tipo_carroceria} - ${veiculo.placa}`;
    dropDown.appendChild(opt);
}

const fetchVehicleData = (selectedVehicle) => {
    let fuelList = document.getElementById("abastecimentos");
    fuelList.innerHTML = "";
    let url = `${BASE_URL}/abastecimentos?Placa=${selectedVehicle}`;
    fetch(url, {
        method: 'GET',
    }).then(response => response.json())
    .then(data => {
        data.abastecimentos.forEach(abastecimento => appendFuel(abastecimento))
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

const appendFuel = (abastecimento) => {
    let ul = document.getElementById("abastecimentos");
    let li = document.createElement("li");
    span = document.createElement("span");
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "x"
    deleteButton.onclick = function () {
        if(confirm("Tem certeza que deseja deletar este registro de abastecimento?"))
        {
            deleteFuel(abastecimento.id)
            ul.removeChild(li)
        }
    }
    const completouTanque = abastecimento.completando_tanque ? "Completo" : "Incompleto"
    li.textContent = `${abastecimento.horario} --- ${abastecimento.volume} L --- R$ ${abastecimento.valor} --- ${completouTanque} `;
    li.appendChild(deleteButton);
    ul.appendChild(li);
}

const addVehicle = () => {
    let addVehicleModal = document.getElementById("addVehicleModal");
    addVehicleModal.style.display = "block";
}

const addFuel = () => {
    let addVehicleModal = document.getElementById("addFuelModal");
    addVehicleModal.style.display = "block";
}

window.onclick = function(event) {
    let addVehicleModal = document.getElementById("addVehicleModal");
    let addFuelModal = document.getElementById("addFuelModal");
    if (event.target == addVehicleModal || event.target == addFuelModal) {
        event.target.style.display = "none";
    }
}

const closeAddVehicleModal = () => {
    let addVehicleModal = document.getElementById("addVehicleModal");
    addVehicleModal.style.display = "none";
}

const closeAddFuelModal = () => {
    let addVehicleModal = document.getElementById("addFuelModal");
    addVehicleModal.style.display = "none";
}

const submitAddVehicle = () => {
    var inputVehicleBody = {
        "placa": document.getElementById("placaInput").value,
        "marca": document.getElementById("marcaInput").value,
        "modelo": document.getElementById("modeloInput").value,
        "ano_fabricacao": document.getElementById("anoFabricacaoInput").value,
        "ano_modelo": document.getElementById("anoModeloInput").value,
        "tipo_carroceria": document.getElementById("tipoCarroceriaInput").value,
    }

    let url = `${BASE_URL}/veiculos`;
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(inputVehicleBody),
        headers: {
            "Content-Type": "application/json",
          },
    })
    .then(response => {
        if(response.status == 200){
            alert("Veículo adicionado com sucesso!");
            closeAddVehicleModal();
        }
        else{
            response.json().then(data => {
                alert(`Erro ao adicionar veículo! ${data.message}`);
            })
        }
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

const submitAddFuel = () => {
    var inputFuelBody = {
        "odometro": document.getElementById("odometroInput").value,
        "volume": document.getElementById("volumeInput").value,
        "valor": document.getElementById("valorInput").value,
        "completando_tanque": document.getElementById("completandoTanqueInput").value,
        "veiculo": document.getElementById("veiculos").value,
    }

    let url = `${BASE_URL}/abastecimentos`;
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(inputFuelBody),
        headers: {
            "Content-Type": "application/json",
          },
    })
    .then(response => {
        if(response.status == 200){
            alert("Abastecimento adicionado com sucesso!");
            closeAddVehicleModal();
        }
        else{
            response.json().then(data => {
                alert(`Erro ao adicionar abastecimento! Confira os campos e tente novamente.`);
            })
        }
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

const deleteVehicle = () => {
    let vehicleList = document.getElementById("veiculos");
    let vehicle = vehicleList.value;
    if(!confirm(`Tem certeza que deseja deletar veículo de placa ${vehicle}?`))
    {
        return;
    }

    let url = `${BASE_URL}/veiculos?Placa=${vehicle}`;
    fetch(url, {
        method: 'DELETE',
    })
    .then(response => {
        if(response.status == 200){
            alert(`Veículo de placa ${vehicle} deletado com sucesso!`);
            vehicleList.remove(vehicleList.selectedIndex);
        }
        else{
            response.json().then(data => {
                alert(`Erro ao deletar veículo.`);
            })
        }
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

const deleteFuel = (id) => {
    let url = `${BASE_URL}/abastecimentos?id=${id}`;
    fetch(url, {
        method: 'DELETE',
    })
    .then(response => {
        if(response.status == 200){
            alert("Registro de abastecimento deletado com sucesso!");
        }
        else{
            response.json().then(data => {
                alert("Erro ao tentar deletar abastecimento.");
            })
        }
    })
    .catch((error) => {
        console.error('Error:', error);
      });
}

fetchExisting();