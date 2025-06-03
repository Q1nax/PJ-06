import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useResize } from '../../../_hooks/useResize';
import moment from 'moment';
import Button from '../../../_general/Button/Button';
import { Arrow_right, Arrow_left } from '../../../_assets/images/arrows';
import { LoaderCircle } from '../../../_general/Loader/Loaders';

function Slider() {
    const searchHistograms = useSelector((state) => state.search.histograms);
    const histograms = searchHistograms && searchHistograms[0] && searchHistograms[0].data ? searchHistograms[0].data : [];
    const risks = searchHistograms && searchHistograms[1] && searchHistograms[1].data ? searchHistograms[1].data : [];
    
    const [arr, setArr] = useState([]);
    const [visibleHistograms, setVisibleHistograms] = useState([]);
    
    let screenW = useResize();
    let [start, setStart] = useState(1);
    let [step, setStep] = useState(9);

    useEffect(() => {
        const sortedArr = [...histograms].sort((a,b) => moment(a.date)-moment(b.date));
        setArr(sortedArr);
        
        let sliceEnd = 9;
        if(screenW <= 1820 && screenW > 1484) {
            sliceEnd = 7;
            setStep(7);
        } else if(screenW <= 1484 && screenW > 1190) {
            sliceEnd = 4;
            setStep(4);
        } else if(screenW <= 1190 && screenW > 972) {
            sliceEnd = 3;
            setStep(3);
        } else if(screenW <= 972 && screenW > 625) {
            sliceEnd = 2;
            setStep(2);
        } else if(screenW <= 652) {
            sliceEnd = 1;
            setStep(1);
        } else {
            sliceEnd = 9;
            setStep(9);
        }
        setVisibleHistograms(sortedArr.slice(0, sliceEnd));
        setStart(1);
    }, [screenW, histograms])


    let handleClick = (e) => {
        if (e.currentTarget.className.includes('right')) {
            setVisibleHistograms(arr.slice(start, start+step));
            setStart(++start);
        } else {
            setStart(--start);
            setVisibleHistograms(arr.slice(start-1, start-1+step));
        }
    }

    return (
        <div className='resul_summary'>
        <Button 
            name='left'
            btnClass='arrows left'
            btnName={<Arrow_left/>}
            disabled={start-1 === 0? true : false}
            onClick={(e) => {handleClick(e)}}
        />
        
        <div className='result_table'>
            <div className='result_table_item headers'>
                <div>Период</div>
                <div>Всего</div>
                <div>Риски</div>
            </div>

            {histograms.length === 0?
                <div className='result_load'>
                    <LoaderCircle
                        strokeWidth={4}
                        animationDuration={1.3}
                        width={70}
                    /> 
                    <span>Загружаем данные</span>
                </div>
                :
                visibleHistograms
                    .map((histogram, index) => {
                        let date = moment(histogram.date).format('DD.MM.YYYY');
                        return <React.Fragment key={histogram.date || index}>
                        <div className='result_table_item'>
                            <div>{date}</div>
                            <div className='item_data'>{histogram.value}</div>
                            <div className='item_data'>{risks.find(risk => risk.date === histogram.date)?.value || 0}</div>
                        </div>
                        <div className='table_septum'></div>
                        </React.Fragment>
                    })
                }
        </div>
        <Button 
            name='right'
            btnClass='arrows right'
            btnName={<Arrow_right/>}
            disabled={start+step > histograms.length? true : false}
            onClick={(e) => {handleClick(e)}}
        />
    </div>
    )


}

export default Slider;