import { Component, OnInit } from '@angular/core';
import { RelatoriosService } from '../services/relatorios.service';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  relatorio: any[] = [];

  constructor(private relatorioService: RelatoriosService) { }

  async ngOnInit() {
    await this.buscarRelatorio();
  }

  async buscarRelatorio(): Promise<void> {
    try {
      this.relatorio = await this.relatorioService.buscarRlatorioFirebase();
      console.log('Relatórios carregados:', this.relatorio);
    } catch (error) {
      console.error('Erro ao buscar os relatórios:', error);
    }
  }

  get totalArrecadado(): number {
    return this.relatorio.reduce((total, item) => total + item.valorPago, 0);
  }

  get totalVeiculos(): number {
    return this.relatorio.length;
  }

  get totalPermanencia(): string {
    let totalHoras = 0;
    let totalMinutos = 0;

    this.relatorio.forEach((item) => {
      if (item.tempoPermanencia) {
        const [horas, minutos] = item.tempoPermanencia
          .replace('h', '')
          .replace('min', '')
          .split(' ')
          .map(Number);

        if (!isNaN(horas) && !isNaN(minutos)) {
          totalHoras += horas;
          totalMinutos += minutos;
        }
      }
    });

    totalHoras += Math.floor(totalMinutos / 60);
    totalMinutos = totalMinutos % 60;

    return `${totalHoras}h ${totalMinutos}min`;
  }
}
