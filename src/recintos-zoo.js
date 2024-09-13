class RecintosZoo { 
    constructor() {
      this.recintos = [
        { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'macaco', quantidade: 3 }] },
        { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
        { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'gazela', quantidade: 1 }] },
        { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
        { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'leao', quantidade: 1 }] }
      ];

      this.animais = {
        LEAO: { tamanho: 3, biomas: ['savana'] },
        LEOPARDO: { tamanho: 2, biomas: ['savana'] },
        CROCODILO: { tamanho: 3, biomas: ['rio'] },
        MACACO: { tamanho: 1, biomas: ['savana', 'floresta'] },
        GAZELA: { tamanho: 2, biomas: ['savana'] },
        HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'] }
      };
    }

    analisaRecintos(tipoAnimal, quantidade) {
      if (!this.animais[tipoAnimal]) {
        return { erro: "Animal inválido" };
      }

      if (quantidade <= 0 || !Number.isInteger(quantidade)) {
        return { erro: "Quantidade inválida" };
      }

      const animal = this.animais[tipoAnimal];
      const recintosViaveis = [];

      this.recintos.forEach(recinto => {
        const espacoOcupado = recinto.animaisExistentes.reduce((total, animal) => 
          total + animal.quantidade * this.animais[animal.especie.toUpperCase()].tamanho, 0
        );

        // Ajuste para não adicionar o espaço extra de forma indevida
        let espacoExtra = 0;
        if (recinto.animaisExistentes.length > 0 && recinto.animaisExistentes.some(a => a.especie.toUpperCase() !== tipoAnimal)) {
          espacoExtra = 1;
        }

        const espacoLivre = recinto.tamanhoTotal - espacoOcupado - espacoExtra;

        // Verificar se o recinto contém carnívoros para impedir adição de macacos
        if (['LEAO', 'LEOPARDO', 'CROCODILO'].some(carnivoro => recinto.animaisExistentes.some(animal => animal.especie.toUpperCase() === carnivoro))) {
          return;
        }

        if (animal.biomas.includes(recinto.bioma) && espacoLivre >= quantidade * animal.tamanho) {
          if (this.verificaConforto(recinto, tipoAnimal, quantidade)) {
            recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - quantidade * animal.tamanho} total: ${recinto.tamanhoTotal})`);
          }
        }
      });

      if (recintosViaveis.length === 0) {
        return { erro: "Não há recinto viável" };
      }

      return { recintosViaveis };
    }

    verificaConforto(recinto, tipoAnimal, quantidade) {
      // Regra 2: Carnívoros devem habitar somente com a própria espécie
      if (['LEAO', 'LEOPARDO', 'CROCODILO'].includes(tipoAnimal)) {
        if (recinto.animaisExistentes.some(animal => animal.especie.toUpperCase() !== tipoAnimal)) {
          return false;
        }
      }

      // Regra 3: Animais já presentes devem continuar confortáveis
      const espacoNecessario = quantidade * this.animais[tipoAnimal].tamanho;
      const espacoOcupado = recinto.animaisExistentes.reduce((total, animal) => 
        total + animal.quantidade * this.animais[animal.especie.toUpperCase()].tamanho, 0
      );
      const espacoExtra = recinto.animaisExistentes.length > 0 ? 1 : 0;
      if (recinto.tamanhoTotal < espacoOcupado + espacoNecessario + espacoExtra) {
        return false;
      }

      // Regra 4: Hipopótamos só toleram outras espécies em savana e rio
      if (tipoAnimal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animaisExistentes.length > 0) {
        return false;
      }

      // Regra 5: Macacos podem coabitar com outras espécies em biomas "savana e rio"
      if (tipoAnimal === 'MACACO' && recinto.bioma === 'savana e rio' && recinto.animaisExistentes.some(a => a.especie.toUpperCase() !== 'MACACO')) {
        return true;
      }

      // Regra 6: Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado
      if (recinto.animaisExistentes.length > 0 && !recinto.animaisExistentes.some(animal => animal.especie.toUpperCase() === tipoAnimal)) {
        if (recinto.tamanhoTotal < espacoOcupado + espacoNecessario + 1) {
          return false;
        }
      }

      return true;
    }
}

// Exemplo de chamada
const zoo = new RecintosZoo();
console.log(zoo.analisaRecintos('MACACO', 2));
console.log(zoo.analisaRecintos('UNICORNIO', 1));

export { RecintosZoo as RecintosZoo };





/*class RecintosZoo {
    constructor() {
      this.recintos = [
        { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'macaco', quantidade: 3 }] },
        { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
        { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'gazela', quantidade: 1 }] },
        { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
        { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'leao', quantidade: 1 }] }
      ];
  
      this.animais = {
        LEAO: { tamanho: 3, biomas: ['savana'] },
        LEOPARDO: { tamanho: 2, biomas: ['savana'] },
        CROCODILO: { tamanho: 3, biomas: ['rio'] },
        MACACO: { tamanho: 1, biomas: ['savana', 'floresta'] },
        GAZELA: { tamanho: 2, biomas: ['savana'] },
        HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'] }
      };
    }
  
    analisaRecintos(tipoAnimal, quantidade) {
      if (!this.animais[tipoAnimal]) {
        return { erro: "Animal inválido" };
      }
  
      if (quantidade <= 0 || !Number.isInteger(quantidade)) {
        return { erro: "Quantidade inválida" };
      }
  
      const animal = this.animais[tipoAnimal];
      const recintosViaveis = [];
  
      this.recintos.forEach(recinto => {
        const espacoOcupado = recinto.animaisExistentes.reduce((total, animal) => total + animal.quantidade * this.animais[animal.especie.toUpperCase()].tamanho, 0);
        const espacoExtra = recinto.animaisExistentes.length > 0 ? 1 : 0;
        const espacoLivre = recinto.tamanhoTotal - espacoOcupado - espacoExtra;
  
        if (animal.biomas.includes(recinto.bioma) && espacoLivre >= quantidade * animal.tamanho) {
          if (this.verificaConforto(recinto, tipoAnimal, quantidade)) {
            recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - quantidade * animal.tamanho} total: ${recinto.tamanhoTotal})`);
          }
        }
      });
  
      if (recintosViaveis.length === 0) {
        return { erro: "Não há recinto viável" };
      }
  
      return { recintosViaveis };
    }
  
    verificaConforto(recinto, tipoAnimal, quantidade) {
      // Regra 2: Carnívoros devem habitar somente com a própria espécie
      if (['LEAO', 'LEOPARDO', 'CROCODILO'].includes(tipoAnimal)) {
        if (recinto.animaisExistentes.some(animal => animal.especie.toUpperCase() !== tipoAnimal)) {
          return false;
        }
      }
  
      // Regra 3: Animais já presentes devem continuar confortáveis
      const espacoNecessario = quantidade * this.animais[tipoAnimal].tamanho;
      const espacoOcupado = recinto.animaisExistentes.reduce((total, animal) => total + animal.quantidade * this.animais[animal.especie.toUpperCase()].tamanho, 0);
      const espacoExtra = recinto.animaisExistentes.length > 0 ? 1 : 0;
      if (recinto.tamanhoTotal < espacoOcupado + espacoNecessario + espacoExtra) {
        return false;
      }
  
      // Regra 4: Hipopótamos só toleram outras espécies em savana e rio
      if (tipoAnimal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animaisExistentes.length > 0) {
        return false;
      }
  
      // Regra 5: Macacos não se sentem confortáveis sozinhos
      if (tipoAnimal === 'MACACO' && recinto.animaisExistentes.length === 0 && quantidade < 2) {
        return false;
      }
  
      // Regra 6: Quando há mais de uma espécie no mesmo recinto, é preciso considerar 1 espaço extra ocupado
      if (recinto.animaisExistentes.length > 0 && !recinto.animaisExistentes.some(animal => animal.especie.toUpperCase() === tipoAnimal)) {
        if (recinto.tamanhoTotal < espacoOcupado + espacoNecessario + 1) {
          return false;
        }
      }
  
      return true;
    }
  }
  
  // Exemplo de chamada
  const zoo = new RecintosZoo();
  console.log(zoo.analisaRecintos('MACACO', 2));
  console.log(zoo.analisaRecintos('UNICORNIO', 1));
  

  export { RecintosZoo as RecintosZoo };*/
