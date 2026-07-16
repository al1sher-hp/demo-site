import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProgressBar from '../components/booking/ProgressBar.jsx';
import StepService from '../components/booking/StepService.jsx';
import StepMaster from '../components/booking/StepMaster.jsx';
import StepDateTime from '../components/booking/StepDateTime.jsx';
import StepContact from '../components/booking/StepContact.jsx';
import StepConfirm from '../components/booking/StepConfirm.jsx';
import StepSuccess from '../components/booking/StepSuccess.jsx';
import { fetchServices, fetchMasters, createBooking } from '../api.js';

const STEP_TITLES = ['Xizmatni tanlang', 'Mutaxassisni tanlang', 'Sana va vaqt', "Ma'lumotlaringiz", 'Tasdiqlash'];

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedService = location.state?.serviceId ?? null;

  const [services, setServices] = useState([]);
  const [masters, setMasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    serviceId: preselectedService,
    masterId: null,
    date: null,
    time: null,
    name: '',
    phone: '+998 ',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([fetchServices(), fetchMasters()])
      .then(([s, m]) => {
        setServices(s);
        setMasters(m);
        setLoading(false);
        if (preselectedService) setStep(2);
      })
      .catch(() => {
        setLoadError(true);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedService = services.find((s) => s.id === form.serviceId);
  const selectedMaster = masters.find((m) => m.id === form.masterId);
  const availableMasters = useMemo(
    () => masters.filter((m) => m.services.includes(form.serviceId)),
    [masters, form.serviceId],
  );

  function update(fields) {
    setForm((f) => ({ ...f, ...fields }));
  }

  function goNext() {
    setStep((s) => s + 1);
  }

  function goBack() {
    if (step === 1) {
      navigate('/');
      return;
    }
    setSubmitError(null);
    setStep((s) => s - 1);
  }

  async function handleConfirm() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createBooking({
        serviceId: form.serviceId,
        masterId: form.masterId,
        date: form.date,
        time: form.time,
        name: form.name.trim(),
        phone: form.phone.trim(),
      });
      setSuccess(true);
    } catch (err) {
      if (err.status === 409) {
        setSubmitError(err.message);
        setForm((f) => ({ ...f, time: null }));
        setStep(3);
      } else {
        setSubmitError("Nimadir xato ketdi. Qaytadan urinib ko'ring.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="booking-screen">
        <StepSuccess
          service={selectedService}
          master={selectedMaster}
          date={form.date}
          time={form.time}
          onDone={() => navigate('/')}
        />
      </div>
    );
  }

  const ready = !loading && !loadError;

  return (
    <div className="booking-screen">
      <div className="booking-topbar">
        <button className="icon-btn back-btn" onClick={goBack} aria-label="Orqaga">
          ←
        </button>
        <div className="booking-title">{STEP_TITLES[step - 1]}</div>
        <div style={{ width: 40 }} />
      </div>
      {ready && <ProgressBar step={step} total={5} />}
      <div className="booking-content">
        {loadError ? (
          <div className="booking-inline-message">Ma'lumotlarni yuklab bo'lmadi — sahifani yangilab ko'ring</div>
        ) : loading ? (
          <div className="booking-inline-message">Yuklanmoqda...</div>
        ) : (
          <>
            {step === 1 && (
              <StepService
                services={services}
                selected={form.serviceId}
                onSelect={(id) => {
                  update({ serviceId: id, masterId: null });
                  goNext();
                }}
              />
            )}
            {step === 2 && (
              <StepMaster
                masters={availableMasters}
                selected={form.masterId}
                onSelect={(id) => {
                  update({ masterId: id });
                  goNext();
                }}
              />
            )}
            {step === 3 && (
              <StepDateTime
                master={selectedMaster}
                date={form.date}
                time={form.time}
                onChange={update}
                onNext={goNext}
                error={submitError}
              />
            )}
            {step === 4 && <StepContact name={form.name} phone={form.phone} onChange={update} onNext={goNext} />}
            {step === 5 && (
              <StepConfirm
                service={selectedService}
                master={selectedMaster}
                date={form.date}
                time={form.time}
                name={form.name}
                phone={form.phone}
                onConfirm={handleConfirm}
                submitting={submitting}
                error={submitError}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
