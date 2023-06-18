'use client'

import React from "react";
import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Collapse, Text } from "@nextui-org/react";
import { Button, Grid } from "@nextui-org/react";



export default function Consume() {
    const [bank, setBank] = useState(null);
    const [filename, setFilename] = useState(null);
    const [df, setDf] = useState(null);
    const [total_df, setTotal_df] = useState(null);
    const [results_df, setResults_df] = useState([]);

    const [chart1, setChart1] = useState(null);
    const [chart2, setChart2] = useState(null);
    const [chart3, setChart3] = useState(null);
    const [chart4, setChart4] = useState(null);
    const [chart5, setChart5] = useState(null);
    const [chart6, setChart6] = useState(null);

    
    const [selectedBank, setSelectedBank] = useState('kakaobank');
    

    // 데이터를 가져오는 로직을 별도의 함수로 분리
    const fetchData = (bankName) => {
        fetch(`http://127.0.0.1:5000/api/getChart?bank=${bankName}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setBank(data.bank);
            setFilename(data.filename);
            setDf(JSON.parse(data.df));
            setTotal_df(JSON.parse(data.total_df));
            setResults_df(data.results_df)
        })
        .catch(error => {
            console.error(error);
        });
    }

    // 최초 렌더링 시에는 기본적으로 Abank 데이터를 가져옵니다.
    // useEffect(() => {
    //     fetchData('kakaobank');
    // }, []);
    useEffect(() => {
        fetchData(selectedBank);
      }, [selectedBank]);
    

    useEffect(() => {
        if (total_df) {
            // --------------------------------------------------------------------------------------
            // 기본 소비분석 코드 1
            const grouped = total_df.reduce((acc, row) => {
                if (acc[row['업명']]) {
                    acc[row['업명']].count += 1;
                    acc[row['업명']].sum += row['출금액'];
                } else {
                    acc[row['업명']] = {
                        count: 1,
                        sum: row['출금액']
                    };
                }
                return acc;
            }, {});

            const sortedGrouped = Object.entries(grouped)
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 3);

            const result = '출금 횟수가 가장 많은 세 가지 업명은 ' + sortedGrouped.map(entry => entry[0]).join(', ') +
                '이고, 각각의 거래금액의 총합은 ' + sortedGrouped.map(entry => entry[1].sum).join(', ') + '원 입니다.';

            document.getElementById('result').innerHTML = result;

            // --------------------------------------------------------------------------------------
            // 기본 소비분석 코드 2
            const grouped1 = total_df.reduce((acc, row) => {
                if (acc[row['거래구분']]) {
                    acc[row['거래구분']].count += 1;
                    acc[row['거래구분']].sum += row['출금액'];
                } else {
                    acc[row['거래구분']] = {
                        count: 1,
                        sum: row['출금액']
                    };
                }
                return acc;
            }, {});

            const sortedGrouped1 = Object.entries(grouped1)
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 3);

            const result1 = '출금 횟수가 가장 많은 세 가지 거래구분은 ' + sortedGrouped1.map(entry => entry[0]).join(', ') +
                '이고, 각각의 거래금액의 총합은 ' + sortedGrouped1.map(entry => entry[1].sum).join(', ') + '원 입니다.';

            document.getElementById('result').innerHTML += '\n' + result1;

            // --------------------------------------------------------------------------------------
            // 그래프 1, 거래금액 상위 20개 업명별 출금액 비율 막대그래프 시각화
            const expenses1 = Object.entries(total_df.reduce((acc, row) => {
                acc[row['업명']] = (acc[row['업명']] || 0) + row['출금액'];
                return acc;
            }, {})).sort((a, b) => b[1] - a[1]).slice(0, 20);

            const labels1 = expenses1.map(row => row[0]);
            const values1 = expenses1.map(row => row[1]);

            const ctx1 = document.getElementById('barChart1').getContext('2d');
            
            if (chart1) chart1.destroy();

            const newChart1 = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: labels1,
                    datasets: [{
                        label: '거래금액(백만 원)',
                        data: values1,
                        backgroundColor: '#92A8D1'
                    }]
                },
                options: {
                    // 그래프 1의 옵션 설정
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: '그래프 1',
                        fontSize: 14
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: '거래금액 상위 20개 업명별 출금액',
                            font: {
                                size: 17
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            setChart1(newChart1);
            
            // --------------------------------------------------------------------------------------
            // 그래프 2, 거래구분별 출금액 막대그래프 시각화
            const expenses2 = Object.entries(total_df.reduce((acc, row) => {
                if (bank !== '국민은행') {
                    acc[row['거래구분']] = (acc[row['거래구분']] || 0) + row['출금액'];
                }
                return acc;
            }, {})).sort((a, b) => b[1] - a[1]).slice(0, 20);

            const labels2 = expenses2.map(row => row[0]);
            const values2 = expenses2.map(row => row[1]);

            const ctx2 = document.getElementById('barChart2').getContext('2d');

            if (chart2) chart2.destroy();

            const newChart2 = new Chart(ctx2, {
                type: 'bar',
                data: {
                    labels: labels2,
                    datasets: [{
                        label: '거래금액(백만 원)',
                        data: values2,
                        backgroundColor: '#92A8D1'
                    }]
                },
                options: {
                    responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: '거래구분별 출금액',
                    fontSize: 14
                },
                plugins: {
                    title: {
                    display: true,
                    text: '거래구분별 출금액',
                    font: {
                        size: 17
                    }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true
                    }
                }
                }
            });
            setChart2(newChart2);

            // --------------------------------------------------------------------------------------
            // 그래프 3, 월 평균 총 출금 금액 막대그래프로 시각화하기
            const grouped2 = total_df.reduce((acc, row) => {
                const month = new Date(row['거래일시']).getMonth() + 1;
                if (!acc[month]) {
                    acc[month] = [];
                }
                acc[month].push(row);
                return acc;
            }, {});

            const mean_by_month = Object.keys(grouped2).map((month) => {
                const sum = grouped2[month].reduce((acc, row) => {
                    return acc + row['출금액'];
                }, 0);
                return {
                    month: parseInt(month),
                    mean: sum / grouped2[month].length
                };
            });
    
            const labels3 = mean_by_month.map((entry) => entry.month);
            const values3 = mean_by_month.map((entry) => entry.mean);
    
            const ctx3 = document.getElementById('barChart3').getContext('2d');
            if (chart3) chart3.destroy();
            const newChart3 = new Chart(ctx3, {
                type: 'bar',
                data: {
                    labels: labels3,
                    datasets: [{
                        label: '평균 출금액 (원)',
                        data: values3,
                        backgroundColor: '#92A8D1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: '월별 평균 출금액',
                        fontSize: 14
                    },
                    plugins: {
                        title: {
                        display: true,
                        text: '월별 평균 출금액',
                        font: {
                            size: 17
                        }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            setChart3(newChart3);
            // --------------------------------------------------------------------------------------
            // 그래프 4, 월별 거래 횟수를 막대그래프로 시각화
            const grouped4 = total_df.reduce((acc, row) => {
            const month = new Date(row['거래일시']).getMonth() + 1;
            if (!acc[month]) {
                acc[month] = 0;
            }
            acc[month]++;
            return acc;
            }, {});

            const labels4 = Object.keys(grouped4);
            const values4 = Object.values(grouped4);

            const ctx4 = document.getElementById('barChart4').getContext('2d');
            if (chart4) chart4.destroy();
            const newChart4 = new Chart(ctx4, {
                type: 'bar',
                data: {
                    labels: labels4,
                    datasets: [{
                        label: '거래 횟수 (회)',
                        data: values4,
                        backgroundColor: '#92A8D1'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: '월별 거래 횟수',
                        fontSize: 14
                    },
                    plugins: {
                        title: {
                        display: true,
                        text: '월별 거래 횟수',
                        font: {
                            size: 17
                        }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true
                        },
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            setChart4(newChart4);
            // --------------------------------------------------------------------------------------
            // 그래프 5, 상위 5개 거래구분 거래횟수 비율 원그래프 시각화
            const counts5 = {};
            total_df.forEach((row) => {
                if (counts5[row['거래구분']]) {
                    counts5[row['거래구분']]++;
                } else {
                    counts5[row['거래구분']] = 1;
                }
            });

            const sortedCounts5 = Object.entries(counts5)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            const labels5 = sortedCounts5.map((row) => row[0]);
            const values5 = sortedCounts5.map((row) => row[1]);
            const colors5 = ['#FFC0CB', '#92A8D1', '#D5A6BD', '#AEC6CF', '#FFA07A'];

            const ctx5 = document.getElementById('pieChart1').getContext('2d');
            if (chart5) chart5.destroy();
            const newChart5 = new Chart(ctx5, {
                type: 'pie',
                data: {
                    labels: labels5,
                    datasets: [{
                        data: values5,
                        backgroundColor: colors5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: '상위 5개 거래구분별 거래횟수 비율',
                        fontSize: 14
                    },
                    plugins: {
                        title: {
                        display: true,
                        text: '상위 5개 거래구분별 거래횟수 비율',
                        font: {
                            size: 17
                        }
                        }
                    }
                }
            });
            setChart5(newChart5);
            // --------------------------------------------------------------------------------------
            // 그래프 6, 상위 15개 업명 거래횟수 비율 원그래프
            const counts6 = {};
            total_df.forEach((row) => {
                if (counts6[row['업명']]) {
                    counts6[row['업명']]++;
                } else {
                    counts6[row['업명']] = 1;
                }
            });

            const sortedCounts6 = Object.entries(counts6)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 15);

            const labels6 = sortedCounts6.map((row) => row[0]);
            const values6 = sortedCounts6.map((row) => row[1]);
            const colors6 = ['#F7CAC9', '#92A8D1', '#FFC0CB', '#AEC6CF', '#FFA07A', '#D5A6BD', '#B19CD9', '#FFDF00', '#C5E384', '#F49AC2', '#FF9AA2', '#FFB347', '#7FCDCD', '#B3C7D6', '#FF6F61'];

            const ctx6 = document.getElementById('pieChart2').getContext('2d');
            if (chart6) chart6.destroy();
            const newChart6 = new Chart(ctx6, {
                type: 'pie',
                data: {
                    labels: labels6,
                    datasets: [{
                        data: values6,
                        backgroundColor: colors6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: '상위 15개 업명별 거래횟수 비율',
                        fontSize: 14
                    },
                    plugins: {
                        title: {
                        display: true,
                        text: '상위 15개 업명별 거래횟수 비율',
                        font: {
                            size: 17
                        }
                        }
                    }
                }
            });
            setChart6(newChart6);
        }
    }, [total_df]);



    return(
        <div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Grid.Container gap={2} justify="center">
                    <Grid>
                        <Button bordered color="primary" auto onClick={() => fetchData('kakaobank')}>
                            카카오뱅크
                        </Button>
                    </Grid>
                    <Grid>
                        <Button bordered color="primary" auto>
                            국민은행
                        </Button>
                    </Grid>
                    <Grid>
                        <Button bordered color="primary" auto onClick={() => fetchData('hanabank')}>
                            하나은행
                        </Button>
                    </Grid>
                </Grid.Container>
            </div>
            <Collapse title="거래 분석">
                <Text>
                <p id="result"></p>
                </Text>
            </Collapse>
            

            <div className="chart-grid">
                <div className="chart-container">
                    <canvas id="barChart1"></canvas>
                </div>

                <div className="chart-container">
                    <canvas id="barChart2"></canvas>
                </div>

                <div className="chart-container">
                    <canvas id="barChart3"></canvas>
                </div>

                <div className="chart-container">
                    <canvas id="barChart4"></canvas>
                </div>

                <div className="chart-container">
                    <canvas id="pieChart1"></canvas>
                </div>

                <div className="chart-container">
                    <canvas id="pieChart2"></canvas>
                </div>
            </div>
            < hr/>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <h2>이상치 탐지</h2>
                </div>
                <style jsx global>{`
                    table {
                        border-collapse: collapse;
                        width: 100%;
                    }
                    th, td {
                        text-align: left;
                        padding: 8px;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                `}</style>
                <table>
                <thead>
                    <tr>
                        <th>거래일시</th>
                        <th>거래구분</th>
                        <th>업명</th>
                        <th>출금액</th>
                        <th>이상치 예측 점수</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {results_df.map((result, index) => (
                        <tr key={index}>
                            <td>{result['거래일시']}</td>
                            <td>{result['거래구분']}</td>
                            <td>{result['업명']}</td>
                            <td>{result['출금액']}</td>
                            <td>{result['이상치 예측 점수']}</td>
                            <td>{result['상태']}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}