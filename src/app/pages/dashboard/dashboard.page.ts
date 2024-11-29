import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importar el plugin
import { BaseDatosService } from 'src/app/services/base-datos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  pedidos: any[] = [];
  ventasProvisionales: any[] = []; // Datos transformados

  chart: any;
  chartType: string = 'productoMasVendidoGeneral'; // Tipo de gráfico seleccionado por defecto

  @ViewChild('barChart', { static: true }) barChart!: ElementRef;

  constructor(
    private router: Router,
    private baseDatosService: BaseDatosService,
  ) {
    Chart.register(...registerables, ChartDataLabels); // Registrar el plugin
  }

  ngOnInit() {
    this.updateChart();
    // Cargar los productos desde la base de datos al inicializar el componente
    this.baseDatosService.obtenerPedidos().subscribe((data) => {
      this.pedidos = data;

      // Transformar los datos de pedidos para que se adapten a la estructura de ventasProvisionales
      this.transformarDatosPedidos();
    });
  }

  // Método para transformar los datos de pedidos a la estructura adecuada
  transformarDatosPedidos() {
    const groupedByMesa = this.pedidos.reduce((acc: any, pedido: any) => {
      const mesa = pedido.Mesa;
      if (!acc[mesa]) {
        acc[mesa] = {
          categoria: `Mesa ${mesa}`,
          productos: []
        };
      }

      // Agregar productos a la mesa correspondiente
      pedido.Productos.forEach((producto: any) => {
        acc[mesa].productos.push({
          nombre: producto.name,
          vendidos: producto.quantity
        });
      });

      return acc;
    }, {});

    // Convertir el objeto agrupado en un array para que sea compatible con el gráfico
    this.ventasProvisionales = Object.values(groupedByMesa);
    console.log(this.ventasProvisionales); // Ver los datos transformados
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
      //case 'productoMasVendido':
      //  this.createChartProductoMasVendido();
      //  break;
      case 'productoMasVendidoGeneral':
        this.createChartProductoMasVendidoGeneral();
        break;
      //case 'totalPorCategoria':
      //  this.createChartTotalPorCategoria();
      //  break;
      case 'totalVendidos':
        this.createChartTotalVendidos();
        break;
    }
  }

  //// Gráfico de Producto Más Vendido de Cada Mesa
  //async createChartProductoMasVendido() {
  //  const labels = this.ventasProvisionales.map(c => c.categoria);
  //  const data = this.ventasProvisionales.map(c =>
  //    Math.max(...c.productos.map((p: { vendidos: number }) => p.vendidos)) // Especificar tipo para 'p'
  //  );
  //
  //  this.chart = new Chart(this.barChart.nativeElement, {
  //    type: 'bar',
  //    data: {
  //      labels,
  //      datasets: [{
  //        label: 'Producto Más Vendido',
  //        data,
  //        backgroundColor: ['#FF6384', '#36A2EB'],
  //      }]
  //    },
  //    options: {
  //      responsive: true,
  //      plugins: {
  //        legend: {
  //          position: 'top',
  //        },
  //        datalabels: { // Configuración del plugin para mostrar los números dentro de las barras
  //          color: 'white',
  //          anchor: 'end',
  //          align: 'top',
  //          font: {
  //            weight: 'bold',
  //          },
  //          formatter: (value) => value, // Mostrar el valor en cada barra
  //        }
  //      }
  //    }
  //  });
  //}

  //// Gráfico de Cantidad de Productos Vendidos Total por Mesa
  //async createChartTotalPorCategoria() {
  //  const labels = this.ventasProvisionales.map(c => c.categoria);
  //  const data = this.ventasProvisionales.map(c =>
  //    c.productos.reduce((sum: number, p: { vendidos: number }) => sum + p.vendidos, 0) // Especificar tipo para 'sum' y 'p'
  //  );
  //
  //  this.chart = new Chart(this.barChart.nativeElement, {
  //    type: 'bar',
  //    data: {
  //      labels,
  //      datasets: [{
  //        label: 'Total Vendidos por Mesa',
  //        data,
  //        backgroundColor: ['#FF6384', '#36A2EB'],
  //      }]
  //    },
  //    options: {
  //      responsive: true,
  //      plugins: {
  //        legend: {
  //          position: 'top',
  //        },
  //        datalabels: { // Agregar el plugin de data labels
  //          color: 'white',
  //          anchor: 'end',
  //          align: 'top',
  //          font: {
  //            weight: 'bold',
  //          },
  //          formatter: (value) => value, // Mostrar el valor dentro de las barras
  //        }
  //      }
  //    }
  //  });
  //}

  // Gráfico de Producto Más Vendido en General
  async createChartProductoMasVendidoGeneral() {
    const productosVendidos = this.ventasProvisionales
      .map(c => c.productos) // Mapeamos las mesas a sus productos
      .reduce((acc, productos) => acc.concat(productos), []); // Aplanamos el array usando concat

    const productosCount = productosVendidos.reduce((acc: { [key: string]: number }, p: { nombre: string; vendidos: number }) => {
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
            color: 'black',
            anchor: 'end',
            align: 'top',
            font: {
              weight: 'bold',
            },
            formatter: (value) => value,
            offset: -20,  // Ajusta el offset para mayor espacio
            
          }
        }
      }
    });
  }

  // Gráfico de Cantidad Total de Productos Vendidos
  async createChartTotalVendidos() {
    const totalVendidos = this.ventasProvisionales.reduce((sum: number, c: { productos: { vendidos: number }[] }) =>
      sum + c.productos.reduce((sumProd: number, p: { vendidos: number }) => sumProd + p.vendidos, 0), 0 // Especificar tipo para 'sum' y 'p'
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
            color: 'black',
            anchor: 'end',
            align: 'top',
            font: {
              weight: 'bold',
            },
            formatter: (value) => value, // Mostrar el valor dentro de las barras
             offset: -20,
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
