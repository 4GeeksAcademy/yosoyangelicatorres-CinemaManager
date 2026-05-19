// Función para inicializar la sala de cine
export function inicializarSala(): number[][] {
    // Creamos una matriz de 8 filas por 10 columnas llena de ceros
    const sala: number[][] = [];
    for (let i = 0; i < 8; i++) {
        const fila: number[] = [];
        for (let j = 0; j < 10; j++) {
            fila.push(0);
        }
        sala.push(fila);
    }
    return sala;
}

// Función para mostrar la sala en consola
export function mostrarSala(sala: number[][]): void {
    console.log("   0 1 2 3 4 5 6 7 8 9"); // Encabezado de columnas
    for (let i = 0; i < sala.length; i++) {
        let filaStr = `${i} `; // Índice de fila
        for (let j = 0; j < sala[i].length; j++) {
            filaStr += sala[i][j] === 0 ? " L" : " X"; // 'L' para libre, 'X' para ocupado
        }
        console.log(filaStr);
    }
}

// Función para reservar un asiento
export function reservarAsiento(sala: number[][], fila: number, columna: number): boolean {
    // Validamos si la posición está dentro del rango de la matriz
    if (fila < 0 || fila >= sala.length || columna < 0 || columna >= sala[0].length) {
        console.error("Error: La posición está fuera del rango de la sala.");
        return false;
    }

    // Verificamos si el asiento ya está ocupado
    if (sala[fila][columna] === 1) {
        console.error("Error: El asiento ya está ocupado.");
        return false;
    }

    // Reservamos el asiento
    sala[fila][columna] = 1;
    console.log(`Éxito: El asiento en fila ${fila}, columna ${columna} ha sido reservado.`);
    return true;
}

// Función para contar asientos libres y ocupados
export function contarDisponibilidad(sala: number[][]): void {
    let libres = 0;
    let ocupados = 0;

    // Recorremos la matriz para contar los asientos
    for (let i = 0; i < sala.length; i++) {
        for (let j = 0; j < sala[i].length; j++) {
            if (sala[i][j] === 0) {
                libres++;
            } else {
                ocupados++;
            }
        }
    }

    console.log(`Asientos libres: ${libres}, Asientos ocupados: ${ocupados}`);
}

// Función para buscar asientos contiguos libres
export function buscarAsientosContiguos(sala: number[][]): [number, number][] | null {
    for (let i = 0; i < sala.length; i++) {
        for (let j = 0; j < sala[i].length - 1; j++) {
            // Buscamos un par de asientos libres adyacentes
            if (sala[i][j] === 0 && sala[i][j + 1] === 0) {
                console.log(`Asientos contiguos libres encontrados en fila ${i}, columnas ${j} y ${j + 1}.`);
                return [[i, j], [i, j + 1]];
            }
        }
    }

    console.log("No hay asientos contiguos libres disponibles.");
    return null;
}

// Función para ejecutar pruebas
export function ejecutarPruebas(): void {
    console.log("Escenario 1: Sala completamente vacía");
    const sala = inicializarSala();
    mostrarSala(sala);

    console.log("\nEscenario 2: Sala parcialmente ocupada");
    reservarAsiento(sala, 2, 3);
    reservarAsiento(sala, 4, 5);
    mostrarSala(sala);

    console.log("\nEscenario 3: Buscar asientos contiguos");
    buscarAsientosContiguos(sala);

    console.log("\nEscenario 4: Sala completamente llena");
    for (let i = 0; i < sala.length; i++) {
        for (let j = 0; j < sala[i].length; j++) {
            sala[i][j] = 1;
        }
    }
    mostrarSala(sala);
    buscarAsientosContiguos(sala);
    reservarAsiento(sala, 0, 0);
}