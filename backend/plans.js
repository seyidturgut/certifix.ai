const PLANS = {
    tek_egitim: {
        id: 'tek_egitim',
        name: 'Tek Eğitim',
        price: 990,
        type: 'one-time',
        limits: {
            trainings: 1,
            certificates_per_training: 100,
            designs: 1,
            assets: 5,
            storage_mb: 100
        },
        features: {
            footer_required: true,
            linkedin_enabled: false,
            zoom_api: false
        }
    },
    baslangic: {
        id: 'baslangic',
        name: 'Başlangıç',
        price: 1490,
        yearly_price: 14900,
        type: 'subscription',
        limits: {
            trainings: 5,
            certificates_per_training: 100,
            designs: 3,
            assets: 15,
            storage_mb: 500
        },
        features: {
            footer_required: true,
            linkedin_enabled: false,
            zoom_api: false
        }
    },
    profesyonel: {
        id: 'profesyonel',
        name: 'Profesyonel',
        price: 3490,
        yearly_price: 34900,
        type: 'subscription',
        limits: {
            trainings: 20,
            certificates_per_training: 500,
            designs: 10,
            assets: 50,
            storage_mb: 2048 // 2GB
        },
        features: {
            footer_required: true,
            linkedin_enabled: true,
            zoom_api: true,
            status_management: true
        }
    },
    kurumsal: {
        id: 'kurumsal',
        name: 'Kurumsal',
        price: 'Özel', // Contract based
        type: 'subscription',
        limits: {
            trainings: 999999, // Unlimited
            certificates_per_training: 999999,
            designs: 999999,
            assets: 999999,
            storage_mb: 10240 // 10GB+
        },
        features: {
            footer_required: true,
            linkedin_enabled: true,
            zoom_api: true,
            white_label: true,
            api_access: true
        }
    }
};

module.exports = { PLANS };
