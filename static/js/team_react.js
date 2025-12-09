const { useState, useEffect } = React;

const TeamSection = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/team')
            .then(response => response.json())
            .then(data => {
                setTeam(data);
                setLoading(false);
            })
            .catch(error => console.error('Error fetching team data:', error));
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="mt-2 text-muted">Memuat Data Tim...</p>
            </div>
        );
    }

    if (team.length === 0) {
        return <div className="text-center text-muted py-5">Data tim periode ini belum diupload admin.</div>;
    }

    return (
        <div className="row justify-content-center">
            {team.map((member, index) => (
                <div key={index} className="col-md-3 col-sm-6 mb-4" data-aos="flip-left" data-aos-delay={index * 100}>
                    <div className="card border-0 text-center h-100 shadow-sm hover-effect">
                        <div className="card-body">
                            <div className="position-relative d-inline-block mb-3">
                                <img 
                                    src={`/uploads/team/${member.photo}`} 
                                    className="rounded-circle shadow" 
                                    style={{ width: '140px', height: '140px', objectFit: 'cover', border: '4px solid white' }} 
                                    alt={member.name}
                                />
                                <span className="position-absolute bottom-0 end-0 bg-warning p-2 rounded-circle border border-white">
                                    ⚡
                                </span>
                            </div>
                            <h5 className="fw-bold mb-1 text-dark">{member.name}</h5>
                            <p className="text-primary small fw-bold text-uppercase">{member.position}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('react-team-root'));
root.render(<TeamSection />);