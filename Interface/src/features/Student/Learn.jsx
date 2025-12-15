import { Container } from "@mui/material"
import StudentNavigation from "../../components/layout/StudentNavigation"

function Content({}) {

    return (
        <div>

        </div>
    )
}

function Learn() {

    return (
        <div className={`min-h-screen bg-gray-100`}>
            <StudentNavigation/>
            <Container>
                <Content/>
            </Container>
        </div>
    )
}

export default Learn;
