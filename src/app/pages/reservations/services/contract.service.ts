import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private lastContractNum: number = 0;

  constructor() {
    // Retrieve the last contract number from the database or any other storage
    this.getLastContractNumFromDatabase();
  }

  private getLastContractNumFromDatabase() {
    // Simulating retrieving the last contract number from the database
    // This can be replaced with your actual API call
    // For now, we'll set it to 1
    this.lastContractNum = 1;
  }

  generateContractNum(): string {
    this.lastContractNum++;
    const year = new Date().getFullYear().toString().slice(-2);
    const paddedNum = this.lastContractNum.toString().padStart(6, '0');
    return `${year}-${paddedNum}`;
  }
}
