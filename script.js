
function toggleCardContent(header) {
    const card = header.parentElement;
    card.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', function () {
    const marcaInput = document.getElementById('marca-input');
    const marcaDataList = document.getElementById('marcas');
    const modeloSelect = document.getElementById('modelo');
    const resultadoDiv = document.getElementById('resultado');
    const precoElement = document.getElementById('preco');

    fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas')
        .then(response => response.json())
        .then(marcas => {
            marcas.forEach(marca => {
                const option = document.createElement('option');
                option.value = marca.nome;
                option.dataset.codigo = marca.codigo;
                marcaDataList.appendChild(option);
            });
        });

    marcaInput.addEventListener('input', function () {
        const options = marcaDataList.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value.toLowerCase() === this.value.toLowerCase()) {
                const codigoMarca = options[i].dataset.codigo;
                carregarModelos(codigoMarca);
                break;
            }
        }
    });

    function carregarModelos(codigoMarca) {
        modeloSelect.disabled = false;
        modeloSelect.innerHTML = '<option value="" disabled selected>Escolha o modelo</option>';
        fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos`)
            .then(response => response.json())
            .then(data => {
                data.modelos.forEach(modelo => {
                    const option = document.createElement('option');
                    option.value = modelo.codigo;
                    option.textContent = modelo.nome;
                    modeloSelect.appendChild(option);
                });
            });
    }

    modeloSelect.addEventListener('change', function () {
        const codigoModelo = this.value;
        const options = marcaDataList.options;
        let codigoMarca = '';
        for (let i = 0; i < options.length; i++) {
            if (options[i].value.toLowerCase() === marcaInput.value.toLowerCase()) {
                codigoMarca = options[i].dataset.codigo;
                break;
            }
        }
        fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos/${codigoModelo}/anos`)
            .then(response => response.json())
            .then(anos => {
                const codigoAno = anos[0].codigo;
                return fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${codigoMarca}/modelos/${codigoModelo}/anos/${codigoAno}`);
            })
            .then(response => response.json())
            .then(dados => {
                resultadoDiv.style.display = 'block';
                precoElement.textContent = `${dados.Valor}`;
            });
    });
});

