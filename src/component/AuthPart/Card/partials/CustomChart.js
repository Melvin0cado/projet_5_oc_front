import Chart from 'chart.js'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

class CustomChart extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { budgetCard, cardId } = this.props
    const { ceil, currentMoney } = budgetCard

    const ctx = document.getElementById(`budgetCard${cardId}`)

    const labels = ['Progression', 'Reste']
    const data = [currentMoney, ceil - currentMoney]
    const backgroundColor = ['#00ff4c', '#225d9b']
    this.setState({ labels, data, backgroundColor })

    const percentage = document.getElementById(`percentage${cardId}`)
    percentage.style.textAlign = 'center'
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [`${labels[0]} : ${data[0]}`, `${labels[1]} : ${data[1]}`],
        datasets: [
          {
            data: [currentMoney, ceil - currentMoney],
            backgroundColor: backgroundColor,
            borderWidth: 0,
            hoverBorderColor: 'black',
            hoverBorderWidth: 1,
          },
        ],
      },
      options: {
        cutoutPercentage: 75,
        tooltips: {
          callbacks: {
            label: this.customLabelChart,
          },
        },
        legend: {
          position: 'top',
          align: 'center',
          onClick: null,
          labels: {
            usePointStyle: true,
            boxWidth: 10,
          },
          display: false,
        },
      },
    })
  }

  componentDidUpdate(prevProps) {
    const { budgetCard, cardId } = this.props
    const { ceil, currentMoney } = budgetCard

    if (prevProps.budgetCard !== budgetCard) {
      const ctx = document.getElementById(`budgetCard${cardId}`)

      const labels = ['Progression', 'Reste']
      const data = [currentMoney, ceil - currentMoney]
      const backgroundColor = ['#00ff4c', '#225d9b']
      this.setState({ labels, data, backgroundColor })

      const percentage = document.getElementById(`percentage${cardId}`)
      percentage.style.textAlign = 'center'
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [`${labels[0]} : ${data[0]}`, `${labels[1]} : ${data[1]}`],
          datasets: [
            {
              data: [currentMoney, ceil - currentMoney],
              backgroundColor: backgroundColor,
              borderWidth: 0,
              hoverBorderColor: 'black',
              hoverBorderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          cutoutPercentage: 75,
          tooltips: {
            callbacks: {
              label: this.customLabelChart,
            },
          },
          legend: {
            position: 'top',
            align: 'center',
            onClick: null,
            labels: {
              usePointStyle: true,
              boxWidth: 10,
            },
            display: false,
          },
        },
      })
    }
  }

  customLabelChart(tooltipItem, data) {
    const index = tooltipItem.index

    const separator = ' : '
    let labelsToSplit = data.labels[index].split(separator)

    let label = labelsToSplit[0] + separator + labelsToSplit[1]

    return label
  }

  render() {
    const { budgetCard, cardId } = this.props
    const { currentMoney, ceil } = budgetCard
    const { data, labels, backgroundColor } = this.state

    const percent = Math.round((currentMoney / ceil) * 100)

    return (
      <>
        <div className="chart-container">
          <div id={`percentage${cardId}`} className="percentage title-size">
            {percent}%
          </div>
          <div className="graphic-container">
            <canvas id={`budgetCard${cardId}`}></canvas>
          </div>
        </div>
        <div className=" flex flex-column">
          {labels !== undefined &&
            labels.map((label, index) => (
              <div key={label} className=" flex">
                <i
                  className="material-icons"
                  style={{ color: backgroundColor[index] }}
                >
                  brightness_1
                </i>
                {label} : {data[index]}
              </div>
            ))}
        </div>
      </>
    )
  }
}

CustomChart.propTypes = {
  budgetCard: PropTypes.object,
  id: PropTypes.number,
  ceil: PropTypes.number,
  currentMoney: PropTypes.number,
  cardId: PropTypes.string,
}

export default CustomChart
