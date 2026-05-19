import {
	buscarAsientosContiguos,
	inicializarSala,
	reservarAsiento
} from './cinemaSeatManager';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
	throw new Error('No se encontro el contenedor principal #app');
}

// Estado global de la sala para mantener la ocupacion actual de asientos.
const sala: number[][] = inicializarSala();

function calcularDisponibilidad(salaActual: number[][]): { libres: number; ocupados: number } {
	let libres = 0;
	let ocupados = 0;

	for (let fila = 0; fila < salaActual.length; fila++) {
		for (let columna = 0; columna < salaActual[fila].length; columna++) {
			if (salaActual[fila][columna] === 0) {
				libres++;
			} else {
				ocupados++;
			}
		}
	}

	return { libres, ocupados };
}

function render(): void {
	const { libres, ocupados } = calcularDisponibilidad(sala);

	app.innerHTML = `
		<main class="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
			<section class="mx-auto w-full max-w-6xl rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/70">
				<header class="mb-6">
					<h1 class="text-2xl font-bold tracking-wide md:text-3xl">Cinema Seat Manager - Panel Visual</h1>
					<p class="mt-2 text-sm text-slate-400">Selecciona un asiento libre para reservarlo.</p>
				</header>

				<div class="mb-6 grid gap-4 sm:grid-cols-2">
					<article class="rounded-xl border border-emerald-700/40 bg-emerald-900/20 p-4">
						<h2 class="text-xs uppercase tracking-widest text-emerald-300">Asientos libres</h2>
						<p class="mt-1 text-3xl font-extrabold text-emerald-400">${libres}</p>
					</article>
					<article class="rounded-xl border border-rose-700/40 bg-rose-900/20 p-4">
						<h2 class="text-xs uppercase tracking-widest text-rose-300">Asientos ocupados</h2>
						<p class="mt-1 text-3xl font-extrabold text-rose-400">${ocupados}</p>
					</article>
				</div>

				<div class="mb-4 flex flex-wrap items-center gap-3">
					<button
						id="btn-buscar-pareja"
						type="button"
						class="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-slate-900 transition hover:bg-amber-300"
					>
						Buscar espacio para Pareja
					</button>
					<span class="text-xs text-slate-400">Verde = libre, Rojo = ocupado</span>
				</div>

				<div class="overflow-x-auto">
					<div class="inline-grid gap-2" style="grid-template-columns: repeat(10, minmax(0, 1fr));">
						${sala
							.map((fila, filaIndex) =>
								fila
									.map((asiento, columnaIndex) => {
										const colorClase = asiento === 0 ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500';
										const estado = asiento === 0 ? 'Libre' : 'Ocupado';
										return `
											<button
												type="button"
												class="seat h-10 w-10 rounded-md text-xs font-bold text-white transition ${colorClase}"
												data-fila="${filaIndex}"
												data-columna="${columnaIndex}"
												aria-label="Fila ${filaIndex}, Columna ${columnaIndex}, ${estado}"
												title="F${filaIndex}-C${columnaIndex} (${estado})"
											>
												${filaIndex}-${columnaIndex}
											</button>
										`;
									})
									.join('')
							)
							.join('')}
					</div>
				</div>
			</section>
		</main>
	`;

	const seatButtons = app.querySelectorAll<HTMLButtonElement>('.seat');

	seatButtons.forEach((button) => {
		button.addEventListener('click', () => {
			const fila = Number(button.dataset.fila);
			const columna = Number(button.dataset.columna);

			if (Number.isNaN(fila) || Number.isNaN(columna)) {
				return;
			}

			const reservado = reservarAsiento(sala, fila, columna);
			if (reservado) {
				render();
			}
		});
	});

	const buscarParejaButton = app.querySelector<HTMLButtonElement>('#btn-buscar-pareja');
	buscarParejaButton?.addEventListener('click', () => {
		const asientos = buscarAsientosContiguos(sala);
		if (!asientos) {
			return;
		}

		for (let i = 0; i < asientos.length; i++) {
			const fila = asientos[i][0];
			const columna = asientos[i][1];
			const selector = `.seat[data-fila="${fila}"][data-columna="${columna}"]`;
			const seat = app.querySelector<HTMLButtonElement>(selector);

			if (seat) {
				seat.classList.add('ring-4', 'ring-yellow-300', 'animate-pulse');
			}
		}
	});
}

render();