import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import AudiobookDescription from '../components/AudiobookDescription'

const AudiobookPage = () => {
    const { id } = useParams()
    const [audiobook, setAudiobook] = useState(null)

    useEffect(() => {
        const getAudiobookData = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/get_audiobook/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                setAudiobook(data.audiobook_data)
            }
        }
        getAudiobookData()
    }, [])
    
    return (
        <div>
            {audiobook && 
                <div>
                    {/* <img src={audiobook.images[0].url} alt={audiobook.name} /> */}
                    <div>Audiobook</div>
                    <div>{audiobook.name}</div>
                    <div>{audiobook.authors[0].name}</div>
                </div>
            }

            {/* Conditional for CRUD */}

            {audiobook && 
                <div>
                    <div>
                        Narrated by 
                        {audiobook.narrators.map((narrator, index) => {
                            return <div key={index}>{narrator.name}</div>
                        })}
                    </div>

                    <div>Description:</div>
                    <AudiobookDescription description={audiobook.description}/>
                </div>
            }

        </div>
    )
}

export default AudiobookPage