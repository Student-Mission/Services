import { Modal, ModalClose, Sheet } from "@mui/joy";
import { Button, Rating } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import { FaArrowRight } from "react-icons/fa";


function RateSkillModal({show, onHide, currentSkill}) {

    const brief = "Your current rating for this skill is based on your profile and previous evaluations";
    // const rate = 5.5;
    
    const getPrecision = (_rate)=>{
        if (_rate === 0) return 0.00;
        return (_rate - parseInt(_rate)).toPrecision(2);
    }

    const computeRate = ()=>{
        if (!currentSkill)
            return 0.0;
        return ((currentSkill.mission_rate * 0.7) + (currentSkill.test_rate * 0.3)).toPrecision(2);
    }

    const rate = currentSkill && currentSkill.test_rate ? currentSkill.test_rate: 0;
    console.log(`Rate skill ${rate}`)
    return (
        <Modal
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onClose={onHide}
            open={show}
        >
            <Sheet
                variant="outlined"
                sx={{ width: {
                    xs: '300px',
                    sm: '450px',
                    lg: '500px'
                }, borderRadius: 'md', p: 3, boxShadow: 'lg' }}
            >
                <ModalClose variant='plain' />
                <h3 className={`roboto-medium text-[23px] text-blue-focus`}>{currentSkill?.name}</h3>
                <p className={`roboto mt-4 text-gray-main text-[16px]`}>{brief}</p>
                <div className={`mt-5`}>
                    <p className={`roboto`}>Current Level</p>
                    <Rating max={10} readOnly value={computeRate()} toPrecision={0.5}
                        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                    />
                    <p className={`font-normal mt- text-[19px] roboto-medium text-sky`}>{computeRate()}/10</p>
                </div>
                <Button sx={{
                    textTransform: 'none'
                }} className={`mt-5! h-[38px] w-full bg-blue-main text-white! gap-3! roboto`}>
                    Start Test (MCQ)
                    <FaArrowRight className={``}/>
                </Button>
            </Sheet>
        </Modal>
    )
}

export default RateSkillModal;
