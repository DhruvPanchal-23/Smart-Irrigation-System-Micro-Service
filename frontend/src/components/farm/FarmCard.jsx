import { Link } from 'react-router-dom'; 
export default function FarmCard({farm})
{
    return <article className="card farm-card">
        <span className="chip">{farm.cropType}</span>
        <h2>{farm.farmName}</h2>
        <p>{farm.area} {farm.areaUnit}</p>
        <small>{farm.location?.address||'Coordinates saved'}</small>
        <Link to={'/farms/'+farm._id}>Open farm</Link>
    </article>;
}
