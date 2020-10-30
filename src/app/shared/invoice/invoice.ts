export class Invoice {
  _id: string;
  date: Date;
  year: number;
  month: number;
  client_id: string;
  invoice_number: string;
  invoice_number_index: number;
  partial_invoice: boolean;
}
