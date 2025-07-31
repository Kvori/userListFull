import { makeAutoObservable } from "mobx"

export default class ErrorStore {
    constructor() {
        this._error = ""
        this._showError = false
        makeAutoObservable(this)
    }

    setError(error) {
        this._error = error
    }

    setShowError(bool) {
        this._showError = bool
    }

    get error() {
        return this._error
    }

    get showError() {
        return this._showError
    }
}
