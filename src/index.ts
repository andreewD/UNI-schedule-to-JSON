import horario from './HORARIO-convertido.json'
import fs from 'fs'

interface Item {
    "CURSOS OFRECIDOS EN EL PERIODO ACADÉMICO 2022-1": string | null
    Column2: string | null
    Column3: string | null
    Column4: string | null
    Column5: string | null
    Column6: string | null | Number
}

interface Carreer {
    name: string
    courses: Array<Course>
}

interface Course {
    name: string
    sections: Array<Section>
}

interface Section {
    code: string | null
    times: Array<SectionTime>
}

interface SectionTime {
    schedule: string | null
    teacher: string | null
}

let formattedSchedule: Item[][] = []

horario.map((item: Item) => {
    if (!!item['CURSOS OFRECIDOS EN EL PERIODO ACADÉMICO 2022-1']) {
        formattedSchedule.push([item])
    } else {
        formattedSchedule[formattedSchedule.length - 1].push(item)
    }
})

let cleanData: Carreer[] = []

formattedSchedule.map((item, i) => {

    //NEW CARREER
    if (
        item[0]["CURSOS OFRECIDOS EN EL PERIODO ACADÉMICO 2022-1"]?.match(
            /^ESCUELA.*$/
        ) ||
        item[0]["CURSOS OFRECIDOS EN EL PERIODO ACADÉMICO 2022-1"] === "CURSOS"
    ) {
        if (item[0]["CURSOS OFRECIDOS EN EL PERIODO ACADÉMICO 2022-1"]?.match(
            /^ESCUELA.*$/
        )) {
            cleanData.push({
                name: item[0]["CURSOS OFRECIDOS EN EL PERIODO ACADÉMICO 2022-1"],
                courses: []
            })
        }
    } else {
        // NEW COURSE
        item.map((courseItem, i) => {
            if (!!courseItem["CURSOS OFRECIDOS EN EL PERIODO ACADÉMICO 2022-1"]) {
                cleanData[cleanData.length - 1].courses.push({
                    name: courseItem["CURSOS OFRECIDOS EN EL PERIODO ACADÉMICO 2022-1"],
                    sections: [
                        {
                            code: courseItem["Column2"],
                            times: [
                                {
                                    schedule: courseItem["Column3"],
                                    teacher: courseItem["Column5"],
                                },
                            ],
                        },
                    ],
                })
            } else {
                // NEW TIMES
                if (!Boolean(!!courseItem["Column2"])) {
                    cleanData[cleanData.length - 1].
                        courses[cleanData[cleanData.length - 1].courses.length - 1].
                        sections[cleanData[cleanData.length - 1].courses[cleanData[cleanData.length - 1].courses.length - 1].sections.length - 1].
                        times.push({
                            schedule: courseItem["Column3"],
                            teacher: courseItem["Column5"],
                        })
                } else {
                    cleanData[cleanData.length - 1].
                        courses[cleanData[cleanData.length - 1].courses.length - 1].
                        sections.push({
                            code: courseItem["Column2"],
                            times: [
                                {
                                    schedule: courseItem["Column3"],
                                    teacher: courseItem["Column5"],
                                },
                            ],
                        })
                }
            }
        })
    }
})


fs.writeFile("formattedSchedule.json", JSON.stringify(cleanData), function (err) {
    if (err) throw err
    console.log('complete')
}
)
