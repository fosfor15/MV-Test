import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { finalize, interval, mergeMap, of, take, tap } from 'rxjs';

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
        this.isNameShown = false;
        this.isDisabled = true;

        this.apiMockService.postName$()
            .pipe(
                mergeMap((responseStatus: boolean) => {
                    if (responseStatus) {
                        this.name = this.form.controls['name'].value!;
                        this.isNameShown = true;
                        this.form.reset();

                        return of(true);
                    } else {
                        this.isErrorShown = this.isTimerShown = true;
                        this.form.reset();

                        setTimeout(() => {
                            this.isErrorShown = false;
                        }, 5e3);

                        return interval(1e3).pipe(
                            take(this.timer),
                            tap(() => {
                                this.timer -= 1;
                            }),
                            finalize(() => {
                                this.timer = 60;
                                this.isTimerShown = false;
                            })
                        );
                    }
                }),
                finalize(() => {
                    this.isDisabled = false;
                })
            )
            .subscribe();
    }

}
