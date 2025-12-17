// src/app/shared/directives/lifecycle-logger.directive.ts

import { Directive, Input, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[appLifecycleLogger]',
  standalone: true, // Si vous utilisez les composants standalone
})
export class LifecycleLoggerDirective implements OnInit, OnDestroy {
  // Optionnel: Pour identifier quel élément est loggé
  @Input() appLifecycleLogger = 'Input';

  constructor() {}

  ngOnInit() {
    console.log(
      `[Lifecycle] ✅ ${this.appLifecycleLogger} CREATED (Step: ${
        this.appLifecycleLogger.split(':')[1]
      })`
    );
  }

  ngOnDestroy() {
    console.log(
      `[Lifecycle] ❌ ${this.appLifecycleLogger} DESTROYED (Step: ${
        this.appLifecycleLogger.split(':')[1]
      })`
    );
  }
}
