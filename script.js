// 전역 변수
let array = Array.from({length: 100}, (_, i) => i + 1);
let target = 50;
let activeAlgorithm = 'linear';
let isSearching = false;
let stats = { comparisons: 0, steps: 0 };

// 알고리즘 정보
const algorithms = {
    linear: {
        name: '순차탐색',
        description: '배열의 처음부터 끝까지 순차적으로 탐색합니다. 정렬이 필요 없지만 O(n)의 시간이 소요됩니다.'
    },
    binary: {
        name: '이진탐색',
        description: '정렬된 배열에서 중간값과 비교하며 탐색 범위를 절반씩 줄입니다. O(log n)의 효율적인 탐색이 가능합니다.'
    },
    interpolation: {
        name: '보간탐색',
        description: '균등 분포 데이터에서 값의 비율로 위치를 예측합니다. 최적의 경우 O(log log n)의 성능을 보입니다.'
    }
};

// DOM 요소
const arrayContainer = document.getElementById('arrayContainer');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const targetInput = document.getElementById('targetInput');
const tabBtns = document.querySelectorAll('.tab-btn');
const stepsEl = document.getElementById('steps');
const comparisonsEl = document.getElementById('comparisons');
const resultEl = document.getElementById('result');
const algoNameEl = document.getElementById('algoName');
const algoDescEl = document.getElementById('algoDesc');

// 초기화
function init() {
    renderArray();
    updateInfo();
    attachEventListeners();
}

// 배열 렌더링
function renderArray() {
    arrayContainer.innerHTML = '';
    
    array.forEach((value, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'array-item-wrapper';
        
        const indexEl = document.createElement('div');
        indexEl.className = 'array-index';
        // 10의 배수 인덱스만 표시
        indexEl.textContent = (index % 10 === 0) ? index : '';
        
        const item = document.createElement('div');
        item.className = 'array-item default';
        item.style.height = `${value}px`;
        item.textContent = '';
        item.dataset.index = index;
        item.title = `값: ${value}, 인덱스: ${index}`;
        
        wrapper.appendChild(indexEl);
        wrapper.appendChild(item);
        arrayContainer.appendChild(wrapper);
    });
}

// 배열 아이템 상태 업데이트
function updateArrayItem(index, state) {
    const items = document.querySelectorAll('.array-item');
    const item = items[index];
    
    if (!item) return;
    
    // 모든 상태 제거
    item.classList.remove('default', 'in-range', 'comparing', 'found');
    
    // 새 상태 추가
    item.classList.add(state);
}

// 범위 내 모든 아이템 표시
function updateRange(left, right) {
    const items = document.querySelectorAll('.array-item');
    
    items.forEach((item, index) => {
        if (index >= left && index <= right) {
            item.classList.remove('default');
            item.classList.add('in-range');
        }
    });
}

// 모든 아이템 초기화
function resetArrayItems() {
    const items = document.querySelectorAll('.array-item');
    items.forEach(item => {
        item.classList.remove('in-range', 'comparing', 'found');
        item.classList.add('default');
    });
}

// 통계 업데이트
function updateStats() {
    stepsEl.textContent = stats.steps;
    comparisonsEl.textContent = stats.comparisons;
}

// 결과 표시
function showResult(found) {
    if (found) {
        resultEl.textContent = '✓';
    } else {
        resultEl.textContent = '✗';
    }
}

// 알고리즘 정보 업데이트
function updateInfo() {
    const algo = algorithms[activeAlgorithm];
    algoNameEl.textContent = algo.name;
    algoDescEl.textContent = algo.description;
}

// Sleep 함수
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 순차탐색
async function linearSearch() {
    stats = { comparisons: 0, steps: 0 };
    updateStats();
    
    for (let i = 0; i < array.length; i++) {
        updateArrayItem(i, 'comparing');
        stats.comparisons++;
        stats.steps++;
        updateStats();
        
        await sleep(600);
        
        if (array[i] === target) {
            updateArrayItem(i, 'found');
            showResult(true);
            return;
        }
        
        updateArrayItem(i, 'default');
    }
    
    showResult(false);
}

// 이진탐색
async function binarySearch() {
    stats = { comparisons: 0, steps: 0 };
    updateStats();
    
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right) {
        updateRange(left, right);
        await sleep(400);
        
        const mid = Math.floor((left + right) / 2);
        updateArrayItem(mid, 'comparing');
        
        stats.comparisons++;
        stats.steps++;
        updateStats();
        
        await sleep(600);
        
        if (array[mid] === target) {
            updateArrayItem(mid, 'found');
            showResult(true);
            return;
        } else if (array[mid] < target) {
            updateArrayItem(mid, 'default');
            left = mid + 1;
        } else {
            updateArrayItem(mid, 'default');
            right = mid - 1;
        }
    }
    
    showResult(false);
}

// 보간탐색
async function interpolationSearch() {
    stats = { comparisons: 0, steps: 0 };
    updateStats();
    
    let left = 0;
    let right = array.length - 1;
    
    while (left <= right && target >= array[left] && target <= array[right]) {
        updateRange(left, right);
        await sleep(400);
        
        if (left === right) {
            updateArrayItem(left, 'comparing');
            stats.comparisons++;
            stats.steps++;
            updateStats();
            
            await sleep(600);
            
            if (array[left] === target) {
                updateArrayItem(left, 'found');
                showResult(true);
            } else {
                updateArrayItem(left, 'default');
                showResult(false);
            }
            return;
        }
        
        const pos = left + Math.floor(
            ((target - array[left]) / (array[right] - array[left])) * (right - left)
        );
        
        updateArrayItem(pos, 'comparing');
        stats.comparisons++;
        stats.steps++;
        updateStats();
        
        await sleep(600);
        
        if (array[pos] === target) {
            updateArrayItem(pos, 'found');
            showResult(true);
            return;
        } else if (array[pos] < target) {
            updateArrayItem(pos, 'default');
            left = pos + 1;
        } else {
            updateArrayItem(pos, 'default');
            right = pos - 1;
        }
    }
    
    showResult(false);
}

// 탐색 시작
async function startSearch() {
    if (isSearching) return;
    
    isSearching = true;
    startBtn.disabled = true;
    resetBtn.disabled = true;
    targetInput.disabled = true;
    tabBtns.forEach(btn => btn.disabled = true);
    
    startBtn.textContent = '탐색 중...';
    resetArrayItems();
    resultEl.textContent = '...';
    
    try {
        switch (activeAlgorithm) {
            case 'linear':
                await linearSearch();
                break;
            case 'binary':
                await binarySearch();
                break;
            case 'interpolation':
                await interpolationSearch();
                break;
        }
    } finally {
        isSearching = false;
        startBtn.disabled = false;
        resetBtn.disabled = false;
        targetInput.disabled = false;
        tabBtns.forEach(btn => btn.disabled = false);
        startBtn.textContent = '탐색 시작';
    }
}

// 초기화
function reset() {
    if (isSearching) return;
    
    stats = { comparisons: 0, steps: 0 };
    updateStats();
    resultEl.textContent = '-';
    resetArrayItems();
}

// 탭 변경
function changeAlgorithm(algorithm) {
    if (isSearching) return;
    
    activeAlgorithm = algorithm;
    
    // 탭 활성화 상태 변경
    tabBtns.forEach(btn => {
        if (btn.dataset.algorithm === algorithm) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    updateInfo();
    reset();
}

// 이벤트 리스너 등록
function attachEventListeners() {
    startBtn.addEventListener('click', startSearch);
    resetBtn.addEventListener('click', reset);
    
    targetInput.addEventListener('change', (e) => {
        target = parseInt(e.target.value);
        reset();
    });
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            changeAlgorithm(btn.dataset.algorithm);
        });
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);