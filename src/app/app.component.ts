import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { finalize, interval, map, mergeMap, take, tap } from 'rxjs';

import { ApiMockServiceService } from './api-mock-service.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

    form = new FormGroup({
        name: new FormControl('', Validators.required)
    });

    name: string = '';
    isNameShown: boolean = false;

    timer: number = 60;
    isTimerShown: boolean = false;

    isDisabled: boolean = false;
    isErrorShown: boolean = false;

    constructor(
        private apiMockService: ApiMockServiceService
    ) {}


    /** Метод обработки нажатия на кнопку Отправить с имитацией отправки
     *
     * @see apiMockService.postName$
     */
    handleSubmit(): void {
        this.apiMockService.postName$()
            .pipe(
                map((responseStatus: boolean) => {
                    if (responseStatus) {
                        this.name = this.form.controls['name'].value!;
                        this.isNameShown = true;
                    } else {
                        this.isErrorShown = true;

                        setTimeout(() => {
                            this.isErrorShown = false;
                        }, 5e3);
                    }

                    this.form.reset();
                }),
                mergeMap(() => {
                    this.timer = 60;
                    this.isTimerShown = this.isDisabled = true;

                    return interval(1e3).pipe(
                        take(this.timer),
                        tap(() => {
                            this.timer -= 1;
                        }),
                        finalize(() => {
                            this.isNameShown = this.isTimerShown = this.isDisabled = false;
                        })
                    );
                })
            )
            .subscribe();
    }

}
