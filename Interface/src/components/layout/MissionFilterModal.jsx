import { FormControl, Modal, RadioGroup, Radio, FormLabel, IconButton } from "@mui/joy";
import { X } from "lucide-react";
import { Box } from "@mui/material";

function MissionFilterModal({show, onHide}) {

    const filters = [
        {value: 'all', label: 'All'},
        {value: 'completed', label: 'Completed'},
        {value: 'in_progress', label: 'In progress'},
        {value: 'not_started', label: 'Not started'}
    ]

    return (
        <Modal open={show} onClose={onHide} sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Box sx={{
                width: {
                    xs: 300,
                    sm: 400,
                    md: 400
                },
                p: 3,
                pt: 1,
                bgcolor: 'white'
            }}>
                <div className="flex items-center justify-end">
                    <IconButton onClick={onHide}>
                        <X/>
                    </IconButton>
                </div>
                <div className="flex gap-5">
                    <RadioGroup className="w-auto">
                    {
                        filters.map((filter, index)=>(
                            <Radio key={index} name="filter" className="" value={filter.value} />
                        ))
                    }
                    </RadioGroup>
                    <div className="">
                        {
                            filters.map((filter, index)=>(
                                <FormLabel key={index} className="mb-1! mt-0! pt-0! roboto text-lg!">
                                    {filter.label}
                                </FormLabel>
                            ))
                        }
                    </div>
                </div>

            </Box>
        </Modal>
    )
}

export default MissionFilterModal;
