export const PLANS = {
    tek_egitim: {
        id: 'tek_egitim',
        name: 'Tek Eğitim',
        price: '990₺',
        type: 'one-time',
        description: 'Tek bir eğitim için ideal çözüm.',
        limits: {
            trainings: 1,
            certificates_per_training: 100,
            designs: 1,
            assets: 5,
            storage_mb: 100
        },
        features: [
            'Sertifika Tasarımcısı',
            'Görsel Yükleme (Logo, İmza)',
            'QR Kod Desteği',
            'Doğrulama Bağlantısı',
            'Eposta Gönderimi'
        ]
    },
    baslangic: {
        id: 'baslangic',
        name: 'Başlangıç',
        price: '1.490₺',
        yearly_price: '14.900₺',
        type: 'subscription',
        description: 'Bireysel eğitmenler ve küçük gruplar için.',
        limits: {
            trainings: 5,
            certificates_per_training: 100,
            designs: 3,
            assets: 15,
            storage_mb: 500
        },
        features: [
            'Ayda 5 Eğitim',
            'Eğitim Başına 100 Sertifika',
            'Sertifika Tasarımcısı',
            'QR Kod & Doğrulama Sayfası',
            'CSV ile Katılımcı İmport',
            'Tek Eğitim paketinin tüm özelliklerini içerir'
        ]
    },
    profesyonel: {
        id: 'profesyonel',
        name: 'Profesyonel',
        price: '3.490₺',
        yearly_price: '34.900₺',
        type: 'subscription',
        color: '#005DFF',
        description: 'Yoğun eğitim düzenleyen profesyoneller için.',
        limits: {
            trainings: 20,
            certificates_per_training: 500,
            designs: 10,
            assets: 50,
            storage_mb: 2048
        },
        features: [
            'Ayda 20 Eğitim',
            'Eğitim Başına 500 Sertifika',
            'LinkedIn "Sertifika Ekle" Entegrasyonu',
            'Özel Durum Yönetimi (Aktif/İptal)',
            'Başlangıç paketinin tüm özelliklerini içerir'
        ]
    },
    kurumsal: {
        id: 'kurumsal',
        name: 'Kurumsal',
        price: 'Bize Ulaşın',
        type: 'contract',
        description: 'Büyük ölçekli kurumlar ve holdingler için.',
        limits: {
            trainings: 'Sınırsız',
            certificates_per_training: 'Sınırsız',
            designs: 'Sınırsız',
            assets: 'Sınırsız',
            storage_mb: 10240
        },
        features: [
            'Sınırsız Sertifika ve Eğitim',
            'White-label Doğrulama Sayfaları',
            'Gelişmiş API Erişimi',
            'Özel Müşteri Temsilcisi',
            'Tüm Profesyonel Özellikler',
            'Özel Sözleşme Şartları'
        ]
    }
};
