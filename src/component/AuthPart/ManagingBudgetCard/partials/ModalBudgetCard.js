import Axios from 'axios'
import M, { Modal } from 'materialize-css'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { api, configApi } from '../../../../config/parameters'
import { catchErr } from '../../../../globalAction/CatchErr'
import { SuccesSwal } from '../../../../globalAction/swal'
import Button from '../../../global/Button'
import DatePicker from '../../../global/DatePicker'
import { clearInput } from '../../../global/function/materializeFunction'

class ModalBudgetCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disabledBtn: true,
      title: '',
      startMoney: 0,
      ceil: '',
      dateSelected: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.inputRequiredVerification = this.inputRequiredVerification.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setDateSelected = this.setDateSelected.bind(this)
  }

  componentDidMount() {
    const { budgetCard, id } = this.props

    const instanceModal = Modal.init(document.getElementById(id))

    if (budgetCard !== undefined) {
      const { title, currentMoney, ceil, limitDate } = budgetCard

      this.setState(
        {
          disabledBtn: false,
          title,
          startMoney: currentMoney,
          ceil,
          dateSelected: limitDate,
        },
        () => M.updateTextFields()
      )
    } else {
      M.updateTextFields()
    }
    this.setState({ instanceModal })
  }

  inputRequiredVerification() {
    const { title, ceil, startMoney, dateSelected } = this.state

    let disabledBtn =
      title === '' ||
      ceil <= 0 ||
      !Number.isInteger(ceil) ||
      !Number.isInteger(startMoney) ||
      startMoney < 0 ||
      dateSelected === ''
    this.setState({ disabledBtn })

    return disabledBtn
  }

  handleChange(e) {
    const { name } = e.target
    let { value } = e.target

    if (Number.isInteger(parseFloat(value))) {
      value = parseInt(value)
    }

    this.setState({ [name]: value }, () => this.inputRequiredVerification())
  }

  setDateSelected(value) {
    this.setState({ dateSelected: value }, () =>
      this.inputRequiredVerification()
    )
  }

  handleSubmit() {
    const {
      token,
      userId,
      budgetCard,
      getCardList,
      getFavoriteRelation,
      edit,
    } = this.props
    const { title, ceil, startMoney, dateSelected, instanceModal } = this.state

    const data = {
      title,
      ceil,
      currentMoney: startMoney,
      limitDate: dateSelected,
      userId,
    }

    if (budgetCard !== undefined && edit !== undefined) {
      return Axios.patch(
        `${api}/api/budget-card/${budgetCard.id}`,
        data,
        configApi(token)
      )
        .then(res => {
          if (res.status === 200) {
            getCardList()
            getFavoriteRelation()

            this.setState(
              {
                disabledBtn: false,
                title: res.data.title,
                startMoney: res.data.currentMoney,
                ceil: res.data.ceil,
                dateSelected: res.data.limitDate,
              },
              () => M.updateTextFields()
            )
            instanceModal.close()
            SuccesSwal("L'édition de l'enveloppe est réussi", null)
          }
        })
        .catch(err => catchErr(err.response))
    }

    Axios.post(`${api}/api/budget-card/create`, data, configApi(token))
      .then(res => {
        if (res.status === 201) {
          clearInput()
          getCardList()
          M.updateTextFields()
          instanceModal.close()
          SuccesSwal("Création de l'enveloppe est réussi", null)
        }
      })
      .catch(err => catchErr(err.response))
  }

  render() {
    const { id, mainTitle } = this.props
    const { disabledBtn, title, ceil, startMoney, dateSelected } = this.state

    return (
      <div id={id} className="modal card">
        <div className="card-content">
          <div className="row bold text-dark-blue3 title-size">{mainTitle}</div>
          <form>
            <div className="input-field col m12  l12">
              <input
                name="title"
                type="text"
                onChange={this.handleChange}
                defaultValue={title}
                required
              />
              <label htmlFor="title">Titre</label>
            </div>
            <div className="input-field col m12  l12">
              <input
                name="ceil"
                type="number"
                onChange={this.handleChange}
                defaultValue={ceil}
                min={1}
                required
              />
              <label htmlFor="ceil">Plafond (ex: 50)</label>
            </div>
            <div className="input-field col m12  l12">
              <input
                name="startMoney"
                type="number"
                onChange={this.handleChange}
                value={startMoney}
                min={0}
                required
              />
              <label htmlFor="startMoney">Argent de départ (minimum : 0)</label>
            </div>
            <DatePicker
              id={`picker${id}`}
              name="limitDate"
              className="input-field col m12  l12"
              defaultValue={dateSelected}
              setDateSelected={this.setDateSelected}
            />
            <Button
              type="button"
              text="Valider"
              disabled={disabledBtn}
              onClick={this.handleSubmit}
            />
          </form>
        </div>
      </div>
    )
  }
}

ModalBudgetCard.propTypes = {
  budgetCard: PropTypes.object,
  token: PropTypes.string,
  userId: PropTypes.number,
  id: PropTypes.string,
  mainTitle: PropTypes.string,
  getCardList: PropTypes.func,
  edit: PropTypes.bool,
  getFavoriteRelation: PropTypes.func,
}

export default ModalBudgetCard
