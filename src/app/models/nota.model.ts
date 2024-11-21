export interface Nota {
    id: number;
    dataEntrada: Date;
    dataSaida: Date;
    horaEntrada: Date;
    horaSaida: Date;
    pagamento: TipoPagamento;
}

export enum TipoPagamento {
    DINHEIRO = 0,
    CARTAO_CREDITO = 1,
    CARTAO_DEBITO = 2,
    PIX = 3
}