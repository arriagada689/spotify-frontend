import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const TrackPage = () => {
    const { id } = useParams()
    const [track, setTrack] = useState(null)
    const [popularTracks, setPopularTracks] = useState(null)
    const [albumData, setAlbumData] = useState(null)

    useEffect(() => {
        const getTrackData = async () => {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
            const response = await fetch(`${apiBaseUrl}/spotify/get_track/${id}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if(response.ok) {
                const data = await response.json()
                setTrack(data.track_data)
                setPopularTracks(data.popular_tracks)
                setAlbumData(data.album_data)
            }
        }
        getTrackData()
    }, [])

    return (
        <div>
            {track && 
                <div>
                    <div>Song</div>
                    <div>{track.name}</div>
                    <div>{track.artists[0].name}</div>
                    <div>{track.album.name}</div>
                    <div>{track.album.release_date.substring(0,4)}</div>
                </div>
            }

            {/* conditional to check if user is logged in */}

            {popularTracks && 
                <div>
                    <div className="text-xl">Popular tracks by <span className='text-green-500'>{track ? track.artists[0].name : ''}</span></div>
                    {popularTracks.map((popular_track, index) => {
                        return <div key={index}>{popular_track.name}</div>
                    })}
                </div>
            }

            {albumData && 
                <div>
                    <div className="text-xl">More from the album <span className='text-green-500'>{track ? track.album.name : ''}</span></div>
                    {albumData.map((album_track, index) => {
                        return <div key={index}>{album_track.name}</div>
                    })}
                </div>
            }

        </div>
    )
}

export default TrackPage