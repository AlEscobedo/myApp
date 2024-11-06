import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importar el plugin

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  ventasProvisionales = [
    {
      categoria: 'Bebidas Calientes',
      productos: [
        { nombre: 'Café Americano', vendidos: 23 },
        { nombre: 'Café Mocaccino', vendidos: 16 },
        { nombre: 'Café Irlandés', vendidos: 13 }
      ]
    },
    {
      categoria: 'Comida',
      productos: [
        { nombre: 'Muffin', vendidos: 13 },
        { nombre: 'Media Luna', vendidos: 37 },
        { nombre: 'Mendozinos', vendidos: 42 }
      ]
    }
  ];

  @ViewChild('barChart', { static: true }) barChart!: ElementRef;
  chart: any;
  chartType: string = 'totalPorCategoria'; // Tipo de gráfico seleccionado por defecto

  constructor(private router: Router) {
    Chart.register(...registerables, ChartDataLabels); // Registrar el plugin
  }

  ngOnInit() {
    this.updateChart();
  }

  // Método para cambiar el tipo de gráfico y actualizarlo
  async onChartTypeChange(event: any) {
    this.chartType = event.detail.value;
    this.updateChart();
  }

  // Método para actualizar el gráfico según el tipo seleccionado
  async updateChart() {
    if (this.chart) {
      this.chart.destroy(); // Destruye el gráfico anterior
    }

    switch (this.chartType) {
      case 'productoMasVendido':
        this.createChartProductoMasVendido();
        break;
      case 'productoMasVendidoGeneral':
        this.createChartProductoMasVendidoGeneral();
        break;
      case 'totalPorCategoria':
        this.createChartTotalPorCategoria();
        break;
      case 'totalVendidos':
        this.createChartTotalVendidos();
        break;
    }
  }

  // Gráfico de Producto Más Vendido de Cada Categoría
  async createChartProductoMasVendido() {
    const labels = this.ventasProvisionales.map(c => c.categoria);
    const data = this.ventasProvisionales.map(c =>
      Math.max(...c.productos.map(p => p.vendidos))
    );

    this.chart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Producto Más Vendido',
          data,
          backgroundColor: ['#FF6384', '#36A2EB'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          datalabels: { // Configuración del plugin para mostrar los números dentro de las barras
            color: 'white',
            anchor: 'end',
            align: 'top',
            font: {
              weight: 'bold',
            },
            formatter: (value) => value, // Mostrar el valor en cada barra
          }
        }
      }
    });
  }

  // Gráfico de Cantidad de Productos Vendidos Total por Categoría
  async createChartTotalPorCategoria() {
    const labels = this.ventasProvisionales.map(c => c.categoria);
    const data = this.ventasProvisionales.map(c =>
      c.productos.reduce((sum, p) => sum + p.vendidos, 0)
    );

    this.chart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Total Vendidos por Categoría',
          data,
          backgroundColor: ['#FF6384', '#36A2EB'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          datalabels: { // Agregar el plugin de data labels
            color: 'white',
            anchor: 'end',
            align: 'top',
            font: {
              weight: 'bold',
            },
            formatter: (value) => value, // Mostrar el valor dentro de las barras
          }
        }
      }
    });
  }

  // Gráfico de Producto Más Vendido en General
  async createChartProductoMasVendidoGeneral() {
    const productosVendidos = this.ventasProvisionales
      .map(c => c.productos) // Mapeamos las categorías a sus productos
      .reduce((acc, productos) => acc.concat(productos), []); // Aplanamos el array usando concat

    const productosCount = productosVendidos.reduce((acc: { [key: string]: number }, p) => {
      acc[p.nombre] = (acc[p.nombre] || 0) + p.vendidos;
      return acc;
    }, {});

    const labels = Object.keys(productosCount);
    const data = Object.values(productosCount);

    this.chart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Producto Más Vendido en General',
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          datalabels: { // Agregar el plugin de data labels
            color: 'white',
            anchor: 'end',
            align: 'top',
            font: {
              weight: 'bold',
            },
            formatter: (value) => value, // Mostrar el valor dentro de las barras
          }
        }
      }
    });
  }

  // Gráfico de Cantidad Total de Productos Vendidos
  async createChartTotalVendidos() {
    const totalVendidos = this.ventasProvisionales.reduce((sum, c) =>
      sum + c.productos.reduce((sumProd, p) => sumProd + p.vendidos, 0), 0
    );

    this.chart = new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Total Vendidos'],
        datasets: [{
          label: 'Total de Productos Vendidos',
          data: [totalVendidos],
          backgroundColor: ['#FFCE56'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          datalabels: { // Agregar el plugin de data labels
            color: 'white',
            anchor: 'end',
            align: 'top',
            font: {
              weight: 'bold',
            },
            formatter: (value) => value, // Mostrar el valor dentro de las barras
          }
        },
        scales: {
          x: { display: false }
        }
      }
    });
  }

  // Navegación a otra página
  async IrInicioAdmin() {
    this.router.navigate(['/inicio-admin']);
  }
}
