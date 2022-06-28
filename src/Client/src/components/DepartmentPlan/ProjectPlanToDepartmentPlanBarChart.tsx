import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip
);

export const options = {

    cutoutPercentage: 70,
    layout: { padding: 25 },
    legend: {
        display: "hidden"
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
        x: {
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: [100, 200, 300, 400, 500, 600, 700],
            backgroundColor: 'rgb(255, 99, 132)',
        },
        {
            label: 'Dataset 2',
            data: [110, 20, 350, 200, 800, 150, 900],
            backgroundColor: 'rgb(75, 192, 192)',
        },
    ],
};


export const ProjectPlanToDepartmentPlanBarChart: React.FunctionComponent = () => {
    const { t } = useTranslation();

    return <div style={{ height: "420px" }}>
        <h4 style={{ marginTop: 0 }}>
            {t('project-to-department-plan-hours')}
        </h4>

        <Bar options={options} data={data} />;
    </div>
} 