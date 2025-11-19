import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <div className="navbar-header border-b border-neutral-200 dark:border-neutral-600">
      <div className="flex items-center justify-between">
        <div className="col-auto">
          <div className="flex flex-wrap items-center gap-[16px]">
            <button type="button" className="sidebar-toggle">
              <iconify-icon icon="heroicons:bars-3-solid" className="icon non-active" />
              <iconify-icon icon="iconoir:arrow-right" className="icon active" />
            </button>
            <button type="button" className="sidebar-mobile-toggle d-flex !leading-[0]">
              <iconify-icon icon="heroicons:bars-3-solid" className="icon !text-[30px]" />
            </button>
            <form className="navbar-search">
              <input type="text" name="search" placeholder="Search" />
              <iconify-icon icon="ion:search-outline" className="icon" />
            </form>
          </div>
        </div>
        <div className="col-auto">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" id="theme-toggle" className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 dark:text-white rounded-full flex justify-center items-center">
              <span id="theme-toggle-dark-icon" className="hidden">
                <i className="ri-sun-line" />
              </span>
              <span id="theme-toggle-light-icon" className="hidden">
                <i className="ri-moon-line" />
              </span>
            </button>
            {/* Language Dropdown Start  */}
            <div className="hidden sm:inline-block">
              <button data-dropdown-toggle="dropdownInformation" className="has-indicator w-10 h-10 bg-neutral-200 dark:bg-neutral-700 dark:text-white rounded-full flex justify-center items-center" type="button">
                <img src="../assets/images/lang-flag.png" alt="image" className="w-6 h-6 object-cover rounded-full" />
              </button>
              <div id="dropdownInformation" className="z-10 hidden bg-white dark:bg-neutral-700 rounded-lg shadow-lg dropdown-menu-sm p-3">
                <div className="py-3 px-4 rounded-lg bg-primary-50 dark:bg-primary-600/25 mb-4 flex items-center justify-between gap-2">
                  <div>
                    <h6 className="text-lg text-neutral-900 font-semibold mb-0">Choose Your Language</h6>
                  </div>
                </div>
                <div className="max-h-[400px] overflow-y-auto scroll-sm pe-2">
                  <div className="mt-4 flex flex-col gap-4">
                    <div className="form-check style-check flex items-center justify-between">
                      <label className="form-check-label line-height-1 font-medium text-secondary-light" htmlFor="english">
                        <span className="text-black hover-bXg-transparent hover-text-primary flex items-center gap-3">
                          <img src="../assets/images/flags/flag1.png" alt='image' className="w-9 h-9 bg-success-subtle text-success-600 rounded-full shrink-0" />
                          <span className="text-base font-semibold mb-0">English</span>
                        </span>
                      </label>
                      <input className="form-check-input rounded-full" name="language" type="radio" id="english" />
                    </div>
                    <div className="form-check style-check flex items-center justify-between">
                      <label className="form-check-label line-height-1 font-medium text-secondary-light" htmlFor="Japan">
                        <span className="text-black hover-bXg-transparent hover-text-primary flex items-center gap-3">
                          <img src="../assets/images/flags/flag2.png" alt='image'  className="w-9 h-9 bg-success-subtle text-success-600 rounded-full shrink-0" />
                          <span className="text-base font-semibold mb-0">Japan</span>
                        </span>
                      </label>
                      <input className="form-check-input rounded-full" name="language" type="radio" id="Japan" />
                    </div>
                    <div className="form-check style-check flex items-center justify-between">
                      <label className="form-check-label line-height-1 font-medium text-secondary-light" htmlFor="Franch">
                        <span className="text-black hover-bXg-transparent hover-text-primary flex items-center gap-3">
                          <img src="../assets/images/flags/flag3.png" alt='image'  className="w-9 h-9 bg-success-subtle text-success-600 rounded-full shrink-0" />
                          <span className="text-base font-semibold mb-0">Franch</span>
                        </span>
                      </label>
                      <input className="form-check-input rounded-full" name="language" type="radio" id="Franch" />
                    </div>
                    <div className="form-check style-check flex items-center justify-between">
                      <label className="form-check-label line-height-1 font-medium text-secondary-light" htmlFor="Germany">
                        <span className="text-black hover-bXg-transparent hover-text-primary flex items-center gap-3">
                          <img src="../assets/images/flags/flag4.png" alt='image'  className="w-9 h-9 bg-success-subtle text-success-600 rounded-full shrink-0" />
                          <span className="text-base font-semibold mb-0">Germany</span>
                        </span>
                      </label>
                      <input className="form-check-input rounded-full" name="language" type="radio" id="Germany" />
                    </div>
                    <div className="form-check style-check flex items-center justify-between">
                      <label className="form-check-label line-height-1 font-medium text-secondary-light" htmlFor="SouthKoria">
                        <span className="text-black hover-bXg-transparent hover-text-primary flex items-center gap-3">
                          <img src="../assets/images/flags/flag5.png" alt='image'  className="w-9 h-9 bg-success-subtle text-success-600 rounded-full shrink-0" />
                          <span className="text-base font-semibold mb-0">South Koria</span>
                        </span>
                      </label>
                      <input className="form-check-input rounded-full" name="language" type="radio" id="SouthKoria" />
                    </div>
                    <div className="form-check style-check flex items-center justify-between">
                      <label className="form-check-label line-height-1 font-medium text-secondary-light" htmlFor="Bangladesh">
                        <span className="text-black hover-bXg-transparent hover-text-primary flex items-center gap-3">
                          <img src="../assets/images/flags/flag6.png" alt='image'  className="w-9 h-9 bg-success-subtle text-success-600 rounded-full shrink-0" />
                          <span className="text-base font-semibold mb-0">Bangladesh</span>
                        </span>
                      </label>
                      <input className="form-check-input rounded-full" name="language" type="radio" id="Bangladesh" />
                    </div>
                    <div className="form-check style-check flex items-center justify-between">
                      <label className="form-check-label line-height-1 font-medium text-secondary-light" htmlFor="India">
                        <span className="text-black hover-bXg-transparent hover-text-primary flex items-center gap-3">
                          <img src="../assets/images/flags/flag7.png" alt='image'  className="w-9 h-9 bg-success-subtle text-success-600 rounded-full shrink-0" />
                          <span className="text-base font-semibold mb-0">India</span>
                        </span>
                      </label>
                      <input className="form-check-input rounded-full" name="language" type="radio" id="India" />
                    </div>
                    <div className="form-check style-check flex items-center justify-between">
                      <label className="form-check-label line-height-1 font-medium text-secondary-light" htmlFor="Koria">
                        <span className="text-black hover-bXg-transparent hover-text-primary flex items-center gap-3">
                          <img src="../assets/images/flags/flag8.png" alt='image'  className="w-9 h-9 bg-success-subtle text-success-600 rounded-full shrink-0" />
                          <span className="text-base font-semibold mb-0">Koria</span>
                        </span>
                      </label>
                      <input className="form-check-input rounded-full" name="language" type="radio" id="Koria" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Language Dropdown End  */}
            {/* Message Dropdown Start  */}
            <button data-dropdown-toggle="dropdownMessage" className="has-indicator w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full flex justify-center items-center" type="button">
              <iconify-icon icon="mage:email" className="text-neutral-900 dark:text-white text-xl" />
            </button>
            <div id="dropdownMessage" className="z-10 hidden bg-white dark:bg-neutral-700 rounded-2xl overflow-hidden shadow-lg max-w-[394px] w-full">
              <div className="py-3 px-4 rounded-lg bg-primary-50 dark:bg-primary-600/25 m-4 flex items-center justify-between gap-2">
                <h6 className="text-lg text-neutral-900 font-semibold mb-0">Messaage</h6>
                <span className="w-10 h-10 bg-white dark:bg-neutral-600 text-primary-600 dark:text-white font-bold flex justify-center items-center rounded-full">05</span>
              </div>
              <div className="scroll-sm !border-t-0">
                <div className="max-h-[400px] overflow-y-auto">
                  <a href="javascript:void(0)" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 relative">
                        <img className="rounded-full w-11 h-11" src="../assets/images/notification/profile-3.png" alt="Joseph image" />
                        <span className="absolute end-[2px] bottom-[2px] w-2.5 h-2.5 bg-success-500 border border-white rounded-full dark:border-gray-600" />
                      </div>
                      <div>
                        <h6 className="text-sm fw-semibold mb-1">Kathryn Murphy</h6>
                        <p className="mb-0 text-sm line-clamp-1">hey! there i'm...</p>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-sm text-neutral-500">12:30 PM</span>
                      <span className="w-4 h-4 text-xs bg-warning-600 text-white rounded-full flex justify-center items-center">8</span>
                    </div>
                  </a>
                  <a href="javascript:void(0)" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 relative">
                        <img className="rounded-full w-11 h-11" src="../assets/images/notification/profile-4.png" alt="Joseph image" />
                        <span className="absolute end-[2px] bottom-[2px] w-2.5 h-2.5 bg-success-500 border border-white rounded-full dark:border-gray-600" />
                      </div>
                      <div>
                        <h6 className="text-sm fw-semibold mb-1">Kathryn Murphy</h6>
                        <p className="mb-0 text-sm line-clamp-1">hey! there i'm...</p>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-sm text-neutral-500">12:30 PM</span>
                      <span className="w-4 h-4 text-xs bg-warning-600 text-white rounded-full flex justify-center items-center">8</span>
                    </div>
                  </a>
                  <a href="javascript:void(0)" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 relative">
                        <img className="rounded-full w-11 h-11" src="../assets/images/notification/profile-5.png" alt="Joseph image" />
                        <span className="absolute end-[2px] bottom-[2px] w-2.5 h-2.5 bg-success-500 border border-white rounded-full dark:border-gray-600" />
                      </div>
                      <div>
                        <h6 className="text-sm fw-semibold mb-1">Kathryn Murphy</h6>
                        <p className="mb-0 text-sm line-clamp-1">hey! there i'm...</p>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-sm text-neutral-500">12:30 PM</span>
                      <span className="w-4 h-4 text-xs bg-warning-600 text-white rounded-full flex justify-center items-center">8</span>
                    </div>
                  </a>
                  <a href="javascript:void(0)" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 relative">
                        <img className="rounded-full w-11 h-11" src="../assets/images/notification/profile-6.png" alt="Joseph image" />
                        <span className="absolute end-[2px] bottom-[2px] w-2.5 h-2.5 bg-success-500 border border-white rounded-full dark:border-gray-600" />
                      </div>
                      <div>
                        <h6 className="text-sm fw-semibold mb-1">Kathryn Murphy</h6>
                        <p className="mb-0 text-sm line-clamp-1">hey! there i'm...</p>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-sm text-neutral-500">12:30 PM</span>
                      <span className="w-4 h-4 text-xs bg-warning-600 text-white rounded-full flex justify-center items-center">8</span>
                    </div>
                  </a>
                  <a href="javascript:void(0)" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 relative">
                        <img className="rounded-full w-11 h-11" src="../assets/images/notification/profile-7.png" alt="Joseph image" />
                        <span className="absolute end-[2px] bottom-[2px] w-2.5 h-2.5 bg-success-500 border border-white rounded-full dark:border-gray-600" />
                      </div>
                      <div>
                        <h6 className="text-sm fw-semibold mb-1">Kathryn Murphy</h6>
                        <p className="mb-0 text-sm line-clamp-1">hey! there i'm...</p>
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-sm text-neutral-500">12:30 PM</span>
                      <span className="w-4 h-4 text-xs bg-warning-600 text-white rounded-full flex justify-center items-center">8</span>
                    </div>
                  </a>
                </div>
                <div className="text-center py-3 px-4">
                  <a href="javascript:void(0)" className="text-primary-600 dark:text-primary-600 font-semibold hover:underline text-center">See All Message </a>
                </div>
              </div>
            </div>
            {/* Message Dropdown End  */}
            {/* Notification Start  */}
            <button data-dropdown-toggle="dropdownNotification" className="has-indicator w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full flex justify-center items-center" type="button">
              <iconify-icon icon="iconoir:bell" className="text-neutral-900 dark:text-white text-xl" />
            </button>
            <div id="dropdownNotification" className="z-10 hidden bg-white dark:bg-neutral-700 rounded-2xl overflow-hidden shadow-lg max-w-[394px] w-full">
              <div className="py-3 px-4 rounded-lg bg-primary-50 dark:bg-primary-600/25 m-4 flex items-center justify-between gap-2">
                <h6 className="text-lg text-neutral-900 font-semibold mb-0">Notification</h6>
                <span className="w-10 h-10 bg-white dark:bg-neutral-600 text-primary-600 dark:text-white font-bold flex justify-center items-center rounded-full">05</span>
              </div>
              <div className="scroll-sm !border-t-0">
                <div className="max-h-[400px] overflow-y-auto">
                  <a href="javascript:void(0)" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 relative w-11 h-11 bg-success-200 dark:bg-success-600/25 text-success-600 flex justify-center items-center rounded-full">
                        <iconify-icon icon="bitcoin-icons:verify-outline" className="text-2xl" />
                      </div>
                      <div>
                        <h6 className="text-sm fw-semibold mb-1">Congratulations</h6>
                        <p className="mb-0 text-sm line-clamp-1">Your profile has been Verified. Your profile has been Verified</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="text-sm text-neutral-500">23 Mins ago</span>
                    </div>
                  </a>
                  <a href="javascript:void(0)" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 relative">
                        <img className="rounded-full w-11 h-11" src="../assets/images/notification/profile-4.png" alt="Joseph image" />
                      </div>
                      <div>
                        <h6 className="text-sm fw-semibold mb-1">Ronald Richards</h6>
                        <p className="mb-0 text-sm line-clamp-1">You can stitch between artboards</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="text-sm text-neutral-500">23 Mins ago</span>
                    </div>
                  </a>
                  <a href="javascript:void(0)" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 relative w-11 h-11 bg-primary-100 dark:bg-primary-600/25 text-primary-600 flex justify-center items-center rounded-full">
                        AM
                      </div>
                      <div>
                        <h6 className="text-sm fw-semibold mb-1">Arlene McCoy</h6>
                        <p className="mb-0 text-sm line-clamp-1">Invite you to prototyping</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="text-sm text-neutral-500">23 Mins ago</span>
                    </div>
                  </a>
                  <a href="javascript:void(0)" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 relative">
                        <img className="rounded-full w-11 h-11" src="../assets/images/notification/profile-6.png" alt="Joseph image" />
                      </div>
                      <div>
                        <h6 className="text-sm fw-semibold mb-1">Annette Black</h6>
                        <p className="mb-0 text-sm line-clamp-1">Invite you to prototyping</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="text-sm text-neutral-500">23 Mins ago</span>
                    </div>
                  </a>
                  <a href="javascript:void(0)" className="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 justify-between gap-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 relative w-11 h-11 bg-primary-100 dark:bg-primary-600/25 text-primary-600 flex justify-center items-center rounded-full">
                        DR
                      </div>
                      <div>
                        <h6 className="text-sm fw-semibold mb-1">Darlene Robertson</h6>
                        <p className="mb-0 text-sm line-clamp-1">Invite you to prototyping</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <span className="text-sm text-neutral-500">23 Mins ago</span>
                    </div>
                  </a>
                </div>
                <div className="text-center py-3 px-4">
                  <a href="javascript:void(0)" className="text-primary-600 dark:text-primary-600 font-semibold hover:underline text-center">See All Notification </a>
                </div>
              </div>
            </div>
            {/* Notification End  */}
            <button data-dropdown-toggle="dropdownProfile" className="flex justify-center items-center rounded-full" type="button">
              <img src="../assets/images/user.png" alt="image" className="w-10 h-10 object-fit-cover rounded-full" />
            </button>
            <div id="dropdownProfile" className="z-10 hidden bg-white dark:bg-neutral-700 rounded-lg shadow-lg dropdown-menu-sm p-3">
              <div className="py-3 px-4 rounded-lg bg-primary-50 dark:bg-primary-600/25 mb-4 flex items-center justify-between gap-2">
                <div>
                  <h6 className="text-lg text-neutral-900 font-semibold mb-0">Shahidul Islam</h6>
                  <span className="text-neutral-500">Admin</span>
                </div>
                <button type="button" className="hover:text-danger-600">
                  <iconify-icon icon="radix-icons:cross-1" className="icon text-xl" />
                </button>
              </div>
              <div className="max-h-[400px] overflow-y-auto scroll-sm pe-2">
                <ul className="flex flex-col">
                  <li>
                    <Link className="text-black px-0 py-2 hover:text-primary-600 flex items-center gap-4" to="/view-profile">
                      <iconify-icon icon="solar:user-linear" className="icon text-xl" />  My Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="text-black px-0 py-2 hover:text-primary-600 flex items-center gap-4" to="/email">
                      <iconify-icon icon="tabler:message-check" className="icon text-xl" />  Inbox
                    </Link>
                  </li>
                  <li>
                    <Link className="text-black px-0 py-2 hover:text-primary-600 flex items-center gap-4" to="/company">
                      <iconify-icon icon="icon-park-outline:setting-two" className="icon text-xl" />  Setting
                    </Link>
                  </li>
                  <li>
                    <a className="text-black px-0 py-2 hover:text-danger-600 flex items-center gap-4" >
                      <iconify-icon icon="lucide:power" className="icon text-xl" />  Log Out
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Header
