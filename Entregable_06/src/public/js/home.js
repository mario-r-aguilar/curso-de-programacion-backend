function navigateToPage(pageValue) {
	const page = document.querySelector('#' + pageValue).value;
	const limit = document.querySelector('#limit').value;
	const url = `/?page=${page}&limit=${limit}`;
	document.location.href = url;
}

document.querySelector('#btnPrev').onclick = () => navigateToPage('prevPage');
document.querySelector('#btnNext').onclick = () => navigateToPage('nextPage');
