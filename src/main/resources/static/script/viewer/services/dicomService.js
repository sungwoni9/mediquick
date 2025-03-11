export class DicomService {

    async fetchDicomSidebarMetadata(studyKey) {
        const response = await fetch(`api/dicom/${studyKey}`);
        if (!response.ok) throw new Error(`HTTP 에러: ${response.status}`);
        return response.json();
    }

    async fetchDicomOverlayMetadata(studyKey, seriesKey) {
        const response = await fetch(`api/dicom/${studyKey}/${seriesKey}`);
        if (!response.ok) throw new Error(`HTTP 에러: ${response.status}`);
        return response.json();
    }

    async fetchDicomImages(studyKey, seriesKey) {
        const response = await fetch(`/api/wado?studykey=${studyKey}&serieskey=${seriesKey}`);
        if (!response.ok) throw new Error(`HTTP 에러: ${response.status}`);

        const data = await response.json();

        if (!Array.isArray(data)) {
            console.warn('fetchDicomImages: 응답이 배열이 아님', data);
            return [];
        }

        return data.map(base64 => `wadouri:data:application/dicom;base64,${base64}`);
    }
}