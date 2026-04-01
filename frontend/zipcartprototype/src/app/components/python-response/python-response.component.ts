import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PythonResponse } from 'src/app/classes/DTOs/PythonResponse';
import { IONIC_UI } from 'src/UIImports';

@Component({
  selector: 'app-python-response',
  templateUrl: './python-response.component.html',
  styleUrls: ['./python-response.component.scss'],
  imports: [IONIC_UI, CommonModule, FormsModule],
  standalone: true,
})
export class PythonResponseComponent implements OnInit {
  response: PythonResponse = {
    success: false,
    data: { productName: '', confidence: 0 },
    topPredictions: [],
  };
  constructor() {}

  ngOnInit() {}
}
