<template>
	<main class="main-wrapper">
		<header class="header">
			<div class="header__content-wrapper">
				<div class="names">
					<h1 class="header-name name1">Владислав</h1>
					<h1 class="header-name name2">Татьяна</h1>
				</div>
				<div class="header__date">
					<h2 class="header__subtitle">Приглашаем на свадьбу</h2>
					<div class="date-fixed">
						<div class="date-fixed-item weekday bordered">Суббота</div>
						<div class="date-fixed-item day">
							<div class="subitem month ">Сентябрь</div>
							<div class="subitem day">23</div>
							<div class="subitem year">2023</div>
						</div>
						<div class="date-fixed-item time bordered">16:30</div>
					</div>
					<div class="date-timer"></div>
				</div>
			</div>
		</header>
		<section class="timesheet">
		</section>
		<!-- <invite-form></invite-form> -->
	</main>
</template>

<script setup>
import InviteForm from '@/components/InviteForm.vue';
</script>

<style lang="scss" scoped>
.main-wrapper {
	max-height: 100vh;
	overflow-y: auto;
	&::-webkit-scrollbar-thumb {
		width: 15px;
		background-color: red;
		border-radius: 10px;
	}
}
.header {
	height: 100vh;

	background-image: url('./assets/header-3.jpg');
	background-position: -200px 0;
	background-repeat: no-repeat;
	background-size: cover;

	&__content-wrapper {
		height: 100%;

		//display: flex;
		//flex-wrap: wrap;
		//justify-content: space-between;
	}
	.names {
		backdrop-filter: blur(3px);
		background-color: rgba($color: black, $alpha: 0.3);
		position: relative;
		top: 0;
		left: 0;
		
		height: 100vh;
		width: 70%;
		@include phone {
			height: 45vh;
			width: 100%;
		}
		
		.header-name {
			color: $c-primary;
			position: absolute;

			font-size: 80px;
			font-family: Elzevir;
			font-weight: 400;
	
			@include phone {
				font-size: 70px;
			}
	
			&.name1 {
				top: 20%;
				left: 4vw;
				@include phone {
					top: 20%;
				}
			}
			&.name2 {
				left: 15vw;
				top: 45%;
				@include phone {
					//left: 30px;
					top: 50%;
				}
			}
		}
	}

	&__subtitle {
		font-size: 25px;
		text-transform: uppercase;
		color: $c-primary-2;
		text-align: center;
	}


	&__date {
		
	}
	.date-fixed {
		display: flex;
		justify-content: center;
		align-items: center;

		margin: 0 auto;
		margin-top: 30px;
		width: 300px;

		&-item {
			display: flex;
			flex-direction: column;			
			align-items: center;
			justify-content: center;

			width: 150px;

			color: $c-primary-2;
			font-size: 20px;

			&.weekday, &.time {
				height: 50px;
				&.bordered {
					border-top: 1px solid $c-primary-2;
					border-bottom: 1px solid $c-primary-2;
				}
			}
			&.day {
				height: 130px;
			}

			.subitem {
				height: 40px;
				line-height: 40px;

				&.day {
					height: 50px;
					line-height: 50px;
					color: $c-primary;
					font-size: 45px;
					font-weight: 400;
				}
			}
		}
	}
}
</style>
